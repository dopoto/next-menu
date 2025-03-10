import {
  type PriceTierChangeScenario,
  priceTiers,
  type PriceTierId,
} from "../_domain/price-tiers";

export function isFreePriceTier(priceTierId: PriceTierId): boolean {
  return priceTiers[priceTierId].monthlyUsdPrice === 0;
}

export function isPaidPriceTier(priceTierId: PriceTierId): boolean {
  return priceTiers[priceTierId].monthlyUsdPrice > 0;
}

export function getPriceTierChangeScenario(
  fromPriceTierId: PriceTierId,
  toPriceTierId: PriceTierId,
): PriceTierChangeScenario | undefined {
  const from = priceTiers[fromPriceTierId];
  const to = priceTiers[toPriceTierId];

  if (isFreePriceTier(from.id) && isPaidPriceTier(to.id)) {
    return "free-to-paid";
  }

  if (isFreePriceTier(from.id) && isFreePriceTier(to.id)) {
    return "free-to-free";
  }

  if (isPaidPriceTier(from.id) && isFreePriceTier(to.id)) {
    return "paid-to-free";
  }

  if (isPaidPriceTier(from.id) && isPaidPriceTier(to.id)) {
    return from.monthlyUsdPrice > to.monthlyUsdPrice
      ? "paid-to-paid-downgrade"
      : "paid-to-paid-upgrade";
  }
}
