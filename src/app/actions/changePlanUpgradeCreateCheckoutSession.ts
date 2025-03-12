"use server";

import { Stripe } from "stripe";
import { env } from "~/env";
import { type PriceTierId } from "../_domain/price-tiers";
import { getValidPaidPriceTier } from "../_utils/price-tier-utils";
 

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

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
  const returnUrl = `${env.NEXT_PUBLIC_APP_URL}/change-plan/upgrade/success/${parsedPaidToTier.id}?session_id={CHECKOUT_SESSION_ID}`;


  const currentStripeSub = parsedPaidFromTier.stripePriceId // E.G. "price_..."
  const stripeSubToUpgradeTo = parsedPaidToTier.stripePriceId // E.G. "price_..."

  // const session = await stripe.checkout.sessions.create({
  //   ui_mode: "embedded",
  //   line_items: [
  //     {
  //       price: parsedPaidToTier.stripePriceId,
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "subscription",
  //   return_url: returnUrl,
  //   customer: props.newStripeCustomerId,
  //   metadata: {
  //     fromTierId: parsedPaidFromTier.id 
  //   }
  // });

  // if (!session.client_secret)
  //   throw new Error("Error initiating Stripe session");

  // return {
  //   clientSecret: session.client_secret,
  // };
  
  return {
    clientSecret: 'TODO',
  };
};
