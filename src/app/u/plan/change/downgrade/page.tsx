import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PriceTier } from "~/app/_domain/price-tiers";
import { lg, obj2str } from "~/app/_utils/string-utils";
import { getCustomerByOrgId } from "~/server/queries";
import { Suspense } from "react";
import ProcessingPlanChange from "../_components/ProcessingPlanChange";
import {
  getPriceTierChangeScenario,
  getValidPaidPriceTier,
} from "~/app/_utils/price-tier-utils";
import {
  getActiveStripeSubscription,
  getActiveSubscriptionItemId,
} from "~/app/_utils/stripe-utils";
import Stripe from "stripe";
import { env } from "~/env";
import { PlanChanged } from "../_components/PlanChanged";
import {
  type StripeCustomerId,
  type StripeRefundId,
  type StripeSubscriptionId,
} from "~/app/_domain/stripe";
import { getExceededFeatures } from "~/app/_utils/price-tier-utils.server-only";
import { ROUTES } from "~/app/_domain/routes";
import { AppError } from "~/lib/error-utils.server";

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

type SearchParams = Promise<Record<"toTierId", string | undefined>>;

export default async function DowngradePage(props: {
  searchParams: SearchParams;
}) {
  const { toTierId } = await props.searchParams;

  return (
    <Suspense fallback={<ProcessingPlanChange progress={14} />}>
      <Step1PreChangeValidations toTierId={toTierId} />
    </Suspense>
  );
}

async function Step1PreChangeValidations(props: { toTierId?: string }) {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    redirect(ROUTES.signIn);
  }

  // Expecting a valid paid From tier:
  const parsedPaidFromTier = getValidPaidPriceTier(
    sessionClaims?.metadata?.tier,
  );
  if (!parsedPaidFromTier) {
    throw new AppError({
      message: `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
    });
  }

  // Expecting a valid paid To tier:
  const parsedPaidToTier = getValidPaidPriceTier(props.toTierId);
  if (!parsedPaidToTier) {
    throw new AppError({
      message: `Missing or invalid To tier in props.toTierId. got: ${props.toTierId}`,
    });
  }

  // Expecting a downgrade:
  const changePlanScenario = getPriceTierChangeScenario(
    parsedPaidFromTier.id,
    parsedPaidToTier.id,
  );
  if (changePlanScenario !== "paid-to-paid-downgrade") {
    throw new AppError({
      message: `Expected 'paid-to-paid-downgrade', got ${changePlanScenario} for ${obj2str(parsedPaidToTier)} to ${obj2str(parsedPaidFromTier)}.`,
    });
  }

  // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
  const exceededFeatures = await getExceededFeatures(
    parsedPaidFromTier.id,
    parsedPaidToTier.id,
  );
  if (exceededFeatures?.length > 0) {
    return redirect(ROUTES.changePlan);
  }

  return (
    <Suspense fallback={<ProcessingPlanChange progress={55} />}>
      <Step2StripeProcessing
        fromTier={parsedPaidFromTier}
        toTier={parsedPaidToTier}
        orgId={orgId}
      />
    </Suspense>
  );
}

async function Step2StripeProcessing(props: {
  fromTier: PriceTier;
  toTier: PriceTier;
  orgId: string;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new AppError({ message: `No userId or orgId found in auth.` });
  }

  const stripeCustomerId = (await getCustomerByOrgId(orgId))
    .stripeCustomerId as StripeCustomerId;
  if (!stripeCustomerId) {
    throw new AppError({
      message: `Expected a stripeCustomerId in our db for ${orgId}, got null instead.`,
    });
  }

  const activeStripeSub = await getActiveStripeSubscription(stripeCustomerId);

  if (!activeStripeSub) {
    throw new AppError({ message: `Active sub missing.` });
  }

  const currentPriceId = activeStripeSub?.items.data[0]?.price.id;
  if (!currentPriceId) {
    throw new AppError({ message: `Missing price id` });
  }
  if (currentPriceId !== props.fromTier.stripePriceId) {
    throw new AppError({
      message: `From tier mismatch. Expected: ${props.fromTier.stripePriceId}. Got: ${currentPriceId}.`,
    });
  }

  const activeStripeSubItemId =
    await getActiveSubscriptionItemId(activeStripeSub);

  // Update the Stripe subscription to the downgraded tier
  const updatedSubscription = await stripe.subscriptions.update(
    activeStripeSub.id,
    {
      items: [
        {
          id: activeStripeSubItemId,
          price: props.toTier.stripePriceId,
        },
      ],
      // Create an invoice immediately with the proration
      proration_behavior: "always_invoice",
      // Keep the same billing cycle date
      billing_cycle_anchor: "unchanged",
    },
  );

  // Find the proration invoice that was just created
  const invoices = await stripe.invoices.list({
    subscription: activeStripeSub.id,
    limit: 1,
    created: {
      // Look for invoices created in the last minute
      gte: Math.floor(Date.now() / 1000) - 60,
    },
  });

  const prorationInvoice = invoices.data[0];

  if (!prorationInvoice) {
    throw new AppError({ message: `ProrationInvoice missing` });
  }

  let refundDetails: StripeDowngradeRefund | null = null;

  // If the invoice represents a credit, process a refund
  if (prorationInvoice && prorationInvoice.total < 0) {
    // Find a charge to refund against
    const charges = await stripe.charges.list({
      customer: stripeCustomerId,
      limit: 5,
    });

    const eligibleCharge = charges.data.find(
      (charge) =>
        !charge.refunded &&
        charge.status === "succeeded" &&
        charge.amount >= Math.abs(prorationInvoice.total),
    );

    if (eligibleCharge) {
      // Process a refund for the credit amount
      const refund = await stripe.refunds.create({
        charge: eligibleCharge.id,
        amount: Math.abs(prorationInvoice.total),
        reason: "requested_by_customer",
        metadata: {
          subscription_id: activeStripeSub.id,
          invoice_id: prorationInvoice.id,
          downgrade_from: props.fromTier.id,
          downgrade_to: props.toTier.id,
        },
      });

      refundDetails = {
        id: refund.id as StripeRefundId,
        amount: refund.amount,
        status: refund.status,
      };
    }
  }

  const details = {
    success: true,
    message: "Subscription successfully downgraded from Tier2 to Tier1",
    subscription: {
      id: updatedSubscription.id as StripeSubscriptionId,
      status: updatedSubscription.status,
      currentPeriodEnd: new Date(
        updatedSubscription.current_period_end * 1000,
      ).toISOString(),
    },
    invoice: {
      id: prorationInvoice.id,
      amount: prorationInvoice.total / 100, // Convert from cents
      currency: prorationInvoice.currency,
      status: prorationInvoice.status,
    },
    refund: refundDetails,
  };

  lg(details);

  // Move user to new tier
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { tier: props.toTier.id },
  });

  return (
    <Suspense fallback={<ProcessingPlanChange progress={100} />}>
      <FinalStepShowConfirmation
        fromTier={props.fromTier}
        toTier={props.toTier}
        txDetails={details}
      />
    </Suspense>
  );
}

async function FinalStepShowConfirmation(props: {
  fromTier: PriceTier;
  toTier: PriceTier;
  txDetails: StripeDowngradeTxDetails;
}) {
  return (
    <SplitScreenContainer
      title="Change plan"
      subtitle="Please enter your payment details below."
      mainComponent={
        <>
          {/* TODO overview */}
          {/* {obj2str(props.txDetails)} */}
          <PlanChanged fromTier={props.fromTier} toTier={props.toTier} />
        </>
      }
    />
  );
}

type StripeDowngradeTxDetails = {
  subscription: {
    id: StripeSubscriptionId;
    status: Stripe.Subscription.Status;
    currentPeriodEnd: string;
  };
  invoice?: StripeDowngradeProrationInvoice;
  refund: StripeDowngradeRefund | null;
};

type StripeDowngradeProrationInvoice = {
  id: string;
  amount: number;
  currency: string;
  status?: Stripe.Invoice.Status | null;
};

type StripeDowngradeRefund = {
  id: StripeRefundId;
  /**
   * Amount in cents.
   */
  amount: number;
  /**
   * pending, requires_action, succeeded, failed, or canceled
   */
  status: string | null;
};
