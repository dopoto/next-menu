import type Stripe from "stripe";


// TODO 


export async function createStripeCustomer(stripeInstance: Stripe): Promise<string> {
  const customer = await stripeInstance.customers.create({
    name: 'Jenny Rosen',
    email: 'jennyrosen@example.com',
  });

  return customer.id;

}


export async function createStripeCustomerSubscription(stripeInstance: Stripe): Promise<string> {
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
