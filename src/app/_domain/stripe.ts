import { z } from "zod";
import { type PriceTierId } from "./price-tiers";

export type StripeCustomerId = `cus_${string}`;
const customerIdPrefix = (() => {
  const testValue: StripeCustomerId = "cus_";
  return testValue.split("_", 1)[0] + "_";
})();

export type StripeSubscriptionId = `sub_${string}`;
export type StripeSubscriptionItemId = `si_${string}`;
export type StripePriceId = `price_${string}`;
export type StripeRefundId = `re_${string}`;

export type UpgradeTiersStripeMetadata = {
  stripeSubscriptionId: StripeSubscriptionId;
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
};

export const stripeCustomerIdSchema = z
  .string()
  .regex(new RegExp(`^${customerIdPrefix}.+`), {
    message: `String must start with "${customerIdPrefix}"`,
  })
  .transform((val) => val as StripeCustomerId);
