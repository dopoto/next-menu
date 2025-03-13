import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { env } from "~/env";
import Stripe from "stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getPriceTierChangeScenario,
  getValidPaidPriceTier,
} from "~/app/_utils/price-tier-utils";
import { obj2str } from "~/app/_utils/string-utils";
import { getCustomerByOrgId } from "~/server/queries";
import { PlanChanged } from "../../_components/PlanChanged";
import {
  type StripeSubscriptionId,
  type UpgradeTiersStripeMetadata,
} from "~/app/_domain/stripe";
import { getActiveSubscriptionItemId } from "~/app/_utils/stripe-utils";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"session_id", string | undefined>>;

/**
 * Users are redirected here after choosing to upgrade between paid price tiers and
 * after paying the more expensive tiers for the rest of the current month.
 * This page will validate the payment and will process moving the org to the new tier.
 */
export default async function UpgradeChangePlanSuccessPage(props: {
  searchParams: SearchParams;
}) {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error(`No auth userId found.`);
  }

  const { session_id: sessionId } = await props.searchParams;
  if (!sessionId) {
    throw new Error("No session_id param");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) {
    throw new Error(
      `No Stripe session found for session_id param "${sessionId}"`,
    );
  }

  // Expecting a complete payment
  if (session.status !== "complete") {
    throw new Error(
      `Expected a session with status=complete, got ${session.status}.`,
    );
  }

  const metadata: UpgradeTiersStripeMetadata | null =
    session.metadata as UpgradeTiersStripeMetadata;

  //Expecting a valid paid From tier:
  const parsedPaidFromTier = getValidPaidPriceTier(metadata?.fromTierId);
  if (!parsedPaidFromTier) {
    throw new Error(
      `Missing or invalid From tier metadata: ${obj2str(metadata ?? {})}`,
    );
  }

  // Expecting a valid paid To tier:
  const parsedPaidToTier = getValidPaidPriceTier(metadata?.toTierId);
  if (!parsedPaidToTier) {
    throw new Error(
      `Missing or invalid To tier metadata: ${obj2str(metadata ?? {})}`,
    );
  }

  // Expecting an upgrade scenario
  const changePlanScenario = getPriceTierChangeScenario(
    parsedPaidFromTier.id,
    parsedPaidToTier.id,
  );
  if (changePlanScenario !== "paid-to-paid-upgrade") {
    throw new Error(
      `Expected 'paid-to-paid-upgrade', got ${changePlanScenario} for ${obj2str(parsedPaidToTier)} to ${obj2str(parsedPaidFromTier)}.`,
    );
  }

  const subscriptionId: StripeSubscriptionId | null =
    metadata.stripeSubscriptionId;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Validate Stripe customer Id
  const stripeCustomerId = subscription.customer;
  if (!stripeCustomerId) {
    throw new Error(
      `No stripeCustomerId found in subscription ${obj2str(subscription)}`,
    );
  }
  if (typeof stripeCustomerId !== "string") {
    throw new Error(
      `Expected string format for Stripe customer id: ${obj2str(stripeCustomerId)}`,
    );
  }

  // Expecting the customer Id returned by Stripe for this sub to match our records
  const dbCustomer = await getCustomerByOrgId(orgId ?? "");
  if (stripeCustomerId !== dbCustomer.stripeCustomerId) {
    throw new Error(
      `Expected db match for Stripe customer id ${stripeCustomerId}, got ${dbCustomer.stripeCustomerId}.`,
    );
  }

  // Move the customer to the upgraded tier in Stripe
  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: getActiveSubscriptionItemId(subscription),
        price: parsedPaidToTier.stripePriceId,
      },
    ],
  });

  // Update Clerk with new tier
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { tier: parsedPaidToTier.id },
  });

  return (
    <SplitScreenContainer
      title={`Thank you!`}
      subtitle="Your price plan has been updated."
      mainComponent={
        <PlanChanged fromTier={parsedPaidFromTier} toTier={parsedPaidToTier} />
      }
    />
  );
}
