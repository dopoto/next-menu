import "server-only";
import {
  priceTierUsageFunctions,
  type PriceTierFeatureId,
} from "../_domain/price-tier-features";
import { auth } from "@clerk/nextjs/server";
import { getValidPriceTier } from "./price-tier-utils";
import { obj2str } from "./string-utils";

/**
 * Returns the number of items included in a feature (E.G. "menus")
 * for the price tier used by the current organization.
 */
export async function getIncludedQuota(
  featureId: PriceTierFeatureId,
): Promise<number | boolean> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

  const parsedTier = getValidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new Error(`Missing or invalid From tier in session claims.`);
  }

  const quota = parsedTier.features.find((f) => f.id === featureId)?.quota;

  if (quota == null) {
    throw new Error(
      `Could not find feature ${featureId} in tier ${obj2str(parsedTier)}`,
    );
  }

  if (quota === true || quota === false) {
    return quota
  }

  if (!isNaN(Number(quota)) && quota > 0) {
    return true;
  }

  return false
}

/**
 * Returns the number of items used by the current organization in a 
 * feature (E.G. "menus") or boolean - for boolean features (E.G. "reports").
 */
export async function getUsedQuota(
  featureId: PriceTierFeatureId,
): Promise<number|boolean> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

  const parsedTier = getValidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new Error(`Missing or invalid tier in session claims.`);
  }

  const usedQuotaFn = priceTierUsageFunctions[featureId];
  const used = usedQuotaFn ? await usedQuotaFn() : 0;

  return used;
}

/**
 * Returns the available quota of the current organization in a 
 * feature (E.G. "menus") or null - for boolean features (E.G. "reports").
 */
export async function getAvailableQuota(
  featureId: PriceTierFeatureId,
): Promise<number|boolean> {
  const included = await getIncludedQuota(featureId);
  if (included === true || included === false) return included;
  const used = await getUsedQuota(featureId);
  if (used === null) return null;
  const available = included - used;
  return available;
}
