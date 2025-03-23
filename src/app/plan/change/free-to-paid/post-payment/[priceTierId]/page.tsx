import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { env } from "~/env";
import Stripe from "stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getValidFreePriceTier,
  getValidPaidPriceTier,
} from "~/app/_utils/price-tier-utils";
import { obj2str } from "~/app/_utils/string-utils";
import { updateCustomerByClerkUserId } from "~/server/queries";
import { PlanChanged } from "../../../_components/PlanChanged";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export type Params = Promise<{ priceTierId: string }>;
type SearchParams = Promise<Record<"session_id", string | undefined>>;

export default async function FreeToPaidPostPaymentPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { priceTierId } = await props.params;

  // Expecting a valid paid To tier:
  const parsedPaidToTier = getValidPaidPriceTier(priceTierId);
  if (!parsedPaidToTier) {
    throw new Error(`Missing or invalid To tier param: ${priceTierId}`);
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
  if (!session.subscription || typeof session.subscription !== "string") {
    throw new Error(
      `Missing or invalid Stripe subscription. session_id: "${sessionId} | session: ${obj2str(session)}"`,
    );
  }

  // Expecting a valid free From tier:
  const parsedFreeFromTier = getValidFreePriceTier(
    session.metadata?.fromTierId,
  );
  if (!parsedFreeFromTier) {
    throw new Error(
      `Missing or invalid From tier metadata: ${obj2str(session?.metadata ?? {})}`,
    );
  }

  //TODO check status = complete?
  // const subscription = await stripe.subscriptions.retrieve(
  //   session.subscription,
  // );

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
  const priceId = lineItems?.data?.[0]?.price?.id;
  if (priceId !== parsedPaidToTier.stripePriceId) {
    throw new Error(
      `Tier not matching = Stripe: ${priceId} | param: ${priceTierId}`,
    );
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error(`No Clerk user id found"`);
  }

  //TODO validate that current tier read from session claims matches parsedPaidFromTier

  // Validate stripeCustomerId and update user records in our db
  const stripeCustomerId = session.customer;
  if (!stripeCustomerId) {
    throw new Error(`No stripeCustomerId found in session ${obj2str(session)}`);
  }
  if (typeof stripeCustomerId !== "string") {
    throw new Error(
      `Expected string format for Stripe customer id: ${obj2str(stripeCustomerId)}`,
    );
  }
  await updateCustomerByClerkUserId(userId, stripeCustomerId);

  // Update Clerk with new tier
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { tier: parsedPaidToTier.id },
  });

  return (
    <SplitScreenContainer
      title={`Thank you!`}
      subtitle="Your subscription has been updated."
      mainComponent={
        <PlanChanged fromTier={parsedFreeFromTier} toTier={parsedPaidToTier} />
      }
    />
  );
}
