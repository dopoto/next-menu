import "server-only";
import {
  priceTierUsageFunctions,
  type PriceTierFeatureId,
} from "../_domain/price-tier-features";
import { auth } from "@clerk/nextjs/server";
import { getValidPriceTier } from "./price-tier-utils";
import { obj2str } from "./string-utils";
import { type PriceTierFlagId } from "~/app/_domain/price-tier-flags";
import { AppError } from "~/lib/error-utils.server";

/**
 * Returns the number of items included in a feature (E.G. "menus")
 * for the price tier used by the current organization.
 */
export async function getIncludedQuota(
  featureId: PriceTierFeatureId,
): Promise<number> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

  const parsedTier = getValidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new AppError({
      internalMessage: `Missing or invalid From tier in session claims.`,
    });
  }

  const included = parsedTier.features.find((f) => f.id === featureId)?.quota;
  if (!included) {
    throw new AppError({
      internalMessage: `Could not find feature ${featureId} in tier ${obj2str(parsedTier)}`,
    });
  }

  return included;
}

/**
 * Returns the number of items used by the current organization in a feature - E.G. "menus".
 */
export async function getUsedFeatureQuota(
  featureId: PriceTierFeatureId,
): Promise<number> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

  const parsedTier = getValidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new AppError({
      internalMessage: `Missing or invalid tier in session claims.`,
    });
  }

  const usedQuotaFn = priceTierUsageFunctions[featureId];
  const used = usedQuotaFn ? await usedQuotaFn() : 0;

  return used;
}

export async function getAvailableFeatureQuota(
  featureId: PriceTierFeatureId,
): Promise<number> {
  const included = await getIncludedQuota(featureId);
  const used = await getUsedFeatureQuota(featureId);
  const available = included - used;
  return available;
}

export async function isFlagAvailableInCurrentTier(
  flagId: PriceTierFlagId,
): Promise<boolean> {
  const priceTierId = (await auth()).sessionClaims?.metadata?.tier;
  const parsedTier = getValidPriceTier(priceTierId);
  if (!parsedTier) {
    throw new AppError({
      internalMessage: `Missing or invalid From tier in session claims.`,
    });
  }

  return parsedTier.flags.find((flag) => flag.id === flagId)?.isEnabled === true
    ? true
    : false;
}
