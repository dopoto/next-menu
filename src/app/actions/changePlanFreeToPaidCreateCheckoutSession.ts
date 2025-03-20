"use server";

import { Stripe } from "stripe";
import { env } from "~/env";
import { type PriceTierId } from "../_domain/price-tiers";
import {
  getValidFreePriceTier,
  getValidPaidPriceTier,
} from "../_utils/price-tier-utils";

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

export const changePlanFreeToPaidCreateCheckoutSession = async (props: {
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
  newStripeCustomerId: string;
}) => {
  // TODO validate priceId, newStripeCustomerId, userauth(?)

  // Expecting a valid free From tier:
  const parsedFreeFromTier = getValidFreePriceTier(props.fromTierId);
  if (!parsedFreeFromTier) {
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
  // TODO put in ROUTES:
  const returnUrl = `${env.NEXT_PUBLIC_APP_URL}/plan/change/free-to-paid/post-payment/${parsedPaidToTier.id}?session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: parsedPaidToTier.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    return_url: returnUrl,
    customer: props.newStripeCustomerId,
    metadata: {
      fromTierId: parsedFreeFromTier.id,
    },
  });

  if (!session.client_secret)
    throw new Error("Error initiating Stripe session");

  return {
    clientSecret: session.client_secret,
  };
};
