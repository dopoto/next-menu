import "server-only";
import Stripe from "stripe";
import {
  StripeSubscriptionId,
  UpgradeTiersStripeMetadata,
  type StripeSubscriptionItemId,
} from "../_domain/stripe";
import { type PriceTierId } from "../_domain/price-tiers";
import { getValidPaidPriceTier } from "./price-tier-utils";
import { auth } from "@clerk/nextjs/server";
import { getCustomerByOrgId } from "~/server/queries";
import { env } from "~/env";
import { obj2str } from "./string-utils";

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

/**
 * NOTE: We assume that our Stripe subscriptions only have one item in them - the current sub.
 */
export function getCurrentSubscriptionItemId(
  subscription: Stripe.Subscription | undefined,
): StripeSubscriptionItemId {
  if (!subscription) {
    throw new Error(`No subscription.`);
  }

  if (subscription.items?.data?.[0]?.plan.active !== true) {
    throw new Error(`Subscription item not active for sub ${subscription.id}`);
  }

  if (!subscription.items?.data?.[0]?.id) {
    throw new Error(`Subscription item not found for sub ${subscription.id}`);
  }

  return subscription.items.data[0].id as StripeSubscriptionItemId;
}

export const changePlanUpgradeCreateCheckoutSession = async (props: {
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
}) => {
  // TODO validate priceId, newStripeCustomerId, userauth(?)

  // Expecting a valid paid From tier:
  const parsedPaidFromTier = getValidPaidPriceTier(props.fromTierId);
  if (!parsedPaidFromTier) {
    throw new Error(
      `Missing or invalid From tier in props.fromTierId: ${props.fromTierId}`,
    );
  }

  // Expecting a valid paid To tier:
  const parsedPaidToTier = getValidPaidPriceTier(props.toTierId);
  if (!parsedPaidToTier) {
    throw new Error(
      `Missing or invalid To tier in props.toTierId: ${props.toTierId}`,
    );
  }

  const { orgId } = await auth();

  if (!orgId) {
    throw new Error(`No orgId found in auth.`);
  }

  const stripeCustomerId = (await getCustomerByOrgId(orgId)).stripeCustomerId;
  if (!stripeCustomerId) {
    throw new Error(
      `Expected a stripeCustomerId in our db for ${orgId}, got null instead.`,
    );
  }

  // Retrieve user's active subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "active",
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    throw new Error(
      `No active subscriptions found for stripeCustomerId ${stripeCustomerId}.`,
    );
  }

  if (subscriptions.data.length > 1) {
    throw new Error(
      `Several active subscriptions found for stripeCustomerId ${stripeCustomerId}.`,
    );
  }

  const subscription = subscriptions.data[0];

  const subscriptionId = subscription?.id as StripeSubscriptionId;

  if (!subscriptionId) {
    throw new Error(
      `Cannot find subscriptionId for stripeCustomerId ${stripeCustomerId}.`,
    );
  }

  const currentSubscription = subscriptions.data[0];

  if (!currentSubscription?.items?.data?.[0]?.id) {
    throw new Error(
      `An id was not found in currentSubscription?.items?.data?.[0] for subscription ${obj2str(currentSubscription)}`,
    );
  }
  const subscriptionItemId = currentSubscription.items.data[0].id; //'si_RvhYtqKirxQTR2'

  // Calculate the prorated amount by previewing an invoice
  const invoicePreview = await stripe.invoices.retrieveUpcoming({
    customer: stripeCustomerId,
    subscription: subscriptionId,
    subscription_items: [
      {
        id: subscriptionItemId,
        price: parsedPaidToTier.stripePriceId,
      },
    ],
    subscription_proration_behavior: "always_invoice",
  });

  // TODO ensure payment is made before redirecting t osuccerss
  // Create a checkout session for the prorated amount

  const metadata: UpgradeTiersStripeMetadata = {
    stripeSubscriptionId: subscriptionId,
    fromTierId: parsedPaidFromTier.id,
    toTierId: parsedPaidToTier.id,
  };
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Subscription Upgrade (Proration)",
            description: `Upgrade from ${parsedPaidFromTier.name} to ${parsedPaidToTier.name}`,
          },
          unit_amount: invoicePreview.amount_due,
        },
        quantity: 1,
      },
    ],
    metadata,
    ui_mode: "embedded",
    return_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
};
