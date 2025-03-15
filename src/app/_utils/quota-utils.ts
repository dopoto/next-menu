import "server-only";
import { priceTierUsageFunctions, type PriceTierFeatureId } from "../_domain/price-tier-features";
import { auth } from "@clerk/nextjs/server";
import { getValidPaidPriceTier } from "./price-tier-utils";
import { obj2str } from "./string-utils";

export async function getAvailableQuota(featureId: PriceTierFeatureId): Promise<number> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

  const parsedTier = getValidPaidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new Error(`Missing or invalid From tier in session claims.`);
  }

  const included = parsedTier.features.find(f => f.id === featureId)?.quota;
  if (!included) {
    throw new Error(`Could not find feature ${featureId} in tier ${obj2str(parsedTier)}`);
  }

  const usedQuotaFn = priceTierUsageFunctions.menus;
  const used = usedQuotaFn ? await usedQuotaFn() : 0;

  const available = included - used;

  return available;
}
