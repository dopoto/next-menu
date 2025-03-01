"use server";

import { Stripe } from "stripe";
import { env } from "~/env";

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

interface NewSessionOptions {
  priceId: string;
}

export const onboardingCreateCheckoutSession = async ({
  priceId,
}: NewSessionOptions) => {
  // TODO
  const returnUrl =
    `${env.NEXT_PUBLIC_APP_URL}/onboarding/pro/post-payment?session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    return_url: returnUrl,
  });

  if (!session.client_secret)
    throw new Error("Error initiating Stripe session");

  return {
    clientSecret: session.client_secret,
  };
};
