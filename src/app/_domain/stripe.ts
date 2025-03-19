import { type PriceTierId } from "./price-tiers";
import  type Stripe from "stripe";

export type StripeCustomerId = `cus_${string}`;
export type StripeSubscriptionId = `sub_${string}`;
export type StripeSubscriptionItemId = `si_${string}`;
export type StripePriceId = `price_${string}`;
export type StripeRefundId = `re_${string}`;

export type UpgradeTiersStripeMetadata = {
  stripeSubscriptionId: StripeSubscriptionId;
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
};

/**
 * Stripe session data that can be sent to client-side components.
 */
export type PublicStripeSubscriptionDetails = Pick<Stripe.Subscription,
  "id" | "current_period_end"
>;

// TODO add more Stripe types, replace in app, add validation schemas
