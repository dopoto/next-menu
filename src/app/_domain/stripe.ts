import { type PriceTierId } from "./price-tiers";

export type StripeCustomerId = `cus_${string}`;
export type StripeSubscriptionId = `sub_${string}`;
export type StripeSubscriptionItemId = `si_${string}`;
export type StripePriceId = `price_${string}`;
export type StripeRefundId = `re_${string}`;


export type UpgradeTiersStripeMetadata = {
    stripeSubscriptionId: StripeSubscriptionId,
    fromTierId: PriceTierId,
    toTierId: PriceTierId
}

// TODO add more Stripe types, replace in app, add validation schemas