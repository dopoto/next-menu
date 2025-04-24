import { auth } from '@clerk/nextjs/server';
import 'server-only';
import { getValidPriceTier } from '~/app/_utils/price-tier-utils';
import { type PriceTierFeatureId } from '~/domain/price-tier-features';
import { type PriceTierFlagId } from '~/domain/price-tier-flags';
import { priceTierUsageFunctions } from '~/domain/price-tier-usage';
import { AppError } from '~/lib/error-utils.server';

/**
 * Returns the number of items included in a feature (E.G. "menus")
 * for the price tier used by the current organization.
 */
export async function getIncludedQuota(featureId: PriceTierFeatureId): Promise<number> {
    const priceTierId = (await auth()).sessionClaims?.metadata?.tier;

    const parsedTier = getValidPriceTier(priceTierId);
    if (!parsedTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in session claims.`,
        });
    }

    const included = parsedTier.features.find((f) => f.id === featureId)?.quota ?? 0;

    return included;
}

/**
 * Returns the number of items used by the current organization in a feature - E.G. "menus".
 */
export async function getUsedFeatureQuota(featureId: PriceTierFeatureId): Promise<number> {
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

export async function getAvailableFeatureQuota(featureId: PriceTierFeatureId): Promise<number> {
    const included = await getIncludedQuota(featureId);
    const used = await getUsedFeatureQuota(featureId);
    const available = included - used;
    return available;
}

export async function isFlagAvailableInCurrentTier(flagId: PriceTierFlagId): Promise<boolean> {
    const priceTierId = (await auth()).sessionClaims?.metadata?.tier;
    const parsedTier = getValidPriceTier(priceTierId);
    if (!parsedTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in session claims.`,
        });
    }

    return parsedTier.flags.find((flag) => flag.id === flagId)?.isEnabled === true ? true : false;
}
