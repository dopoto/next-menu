import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PriceTier } from "~/app/_domain/price-tiers";
import { obj2str } from "~/app/_utils/string-utils";
import {
  getCustomerByOrgId,
  updateCustomerByClerkUserId,
} from "~/server/queries";
import { PlanChanged } from "../_components/PlanChanged";
import { Suspense } from "react";
import ProcessingPlanChange from "../_components/ProcessingPlanChange";
import {
  getValidFreePriceTier,
  getValidPaidPriceTier,
} from "~/app/_utils/price-tier-utils";
import { getExceededFeatures } from "~/app/_utils/price-tier-utils.server-only";
import { ROUTES } from "~/app/_domain/routes";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"toTierId", string | undefined>>;

export default async function PaidToFreePage(props: {
  searchParams: SearchParams;
}) {
  const { toTierId } = await props.searchParams;
  return (
    <Suspense fallback={<ProcessingPlanChange progress={12} />}>
      <Step1 toTierId={toTierId} />
    </Suspense>
  );
}

async function Step1(props: { toTierId?: string }) {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Expecting a valid paid From tier:
  const parsedPaidFromTier = getValidPaidPriceTier(
    sessionClaims?.metadata?.tier,
  );
  if (!parsedPaidFromTier) {
    throw new Error(
      `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
    );
  }

  // Expecting a valid free To tier:
  const parsedFreeToTier = getValidFreePriceTier(props.toTierId);
  if (!parsedFreeToTier) {
    throw new Error(
      `Missing or invalid To tier in props.toTierId. got: ${props.toTierId}`,
    );
  }

  // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
  const exceededFeatures = await getExceededFeatures(
    parsedPaidFromTier.id,
    parsedFreeToTier.id,
  );
  if (exceededFeatures?.length > 0) {
    return redirect(ROUTES.changePlan);
  }
  
  return (
    <Suspense fallback={<ProcessingPlanChange progress={40} />}>
      <Step2
        fromTier={parsedPaidFromTier}
        toTier={parsedFreeToTier}
        orgId={orgId}
      />
    </Suspense>
  );
}

async function Step2(props: {
  fromTier: PriceTier;
  toTier: PriceTier;
  orgId: string;
}) {
  const stripeCustomerId = (await getCustomerByOrgId(props.orgId))
    .stripeCustomerId;
  if (!stripeCustomerId) {
    throw new Error(
      `Cannot find Stripe customer for organization ${props.orgId}`,
    );
  }

  // TODO refactor - extract to util fn:

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
  });

  if (!subscriptions || subscriptions.data.length === 0) {
    throw new Error(
      `No active subscription found for customer ${stripeCustomerId}`,
    );
  }

  if (subscriptions.data.length > 1) {
    throw new Error(
      `More than 1 subscription found for customer ${stripeCustomerId}`,
    );
  }

  const currentSubscription = subscriptions.data[0];

  if (!currentSubscription?.items?.data?.[0]?.id) {
    throw new Error(
      `An id was not found in currentSubscription?.items?.data?.[0] for subscription ${obj2str(currentSubscription)}`,
    );
  }

  return (
    <Suspense fallback={<ProcessingPlanChange progress={60} />}>
      <FinalStep
        stripeSubscription={currentSubscription}
        fromTier={props.fromTier}
        toTier={props.toTier}
      />
    </Suspense>
  );
}

async function FinalStep(props: {
  stripeSubscription: Stripe.Subscription;
  fromTier: PriceTier;
  toTier: PriceTier;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error(`No Clerk user id found"`);
  }

  // Cancel their Stripe subscription
  await stripe.subscriptions.cancel(props.stripeSubscription.id, {
    cancellation_details: {
      comment: "User moved to free tier using /change-plan/paid-to-free.",
    },
    prorate: true,
  });

  // Delete their Stripe customer id from our records.
  await updateCustomerByClerkUserId(userId, null);

  // Update Clerk with new tier
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { tier: props.toTier.id },
  });

  return (
    <SplitScreenContainer
      title={`Thank you!`}
      subtitle="Your subscription has been updated."
      mainComponent={
        <PlanChanged fromTier={props.fromTier} toTier={props.toTier} />
      }
    />
  );
}
