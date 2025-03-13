import type Stripe from "stripe";
import { type StripeSubscriptionItemId } from "../_domain/stripe";

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

// TODO

export async function createStripeCustomer(
  stripeInstance: Stripe,
): Promise<string> {
  const customer = await stripeInstance.customers.create({
    name: "Jenny Rosen",
    email: "jennyrosen@example.com",
  });

  return customer.id;
}

export async function createStripeCustomerSubscription(
  stripeInstance: Stripe,
): Promise<string> {
  const subscription = await stripeInstance.subscriptions.create({
    customer: "cus_Na6dX7aXxi11N4",
    items: [
      {
        price: "price_1MowQULkdIwHu7ixraBm864M",
      },
    ],
  });

  return subscription.id;

  // await stripeInstance.subscriptions.create(currentSubscription.id, {
  //   items: [
  //     {
  //       id: currentSubscription.items.data[0].id,
  //       price: toTierStripePriceId,
  //     },
  //   ],
  //   // Prorate immediately and create an invoice
  //   proration_behavior: "always_invoice",
  //   metadata: {
  //     orgId,
  //     userId,
  //     tierId: parsedToTier.id,
  //   },
  // });
}
