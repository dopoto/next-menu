import {
    type PriceTier,
    type PriceTierChangeScenario,
    type PriceTierId,
    PriceTierIdSchema,
    priceTiers,
} from '~/domain/price-tiers';
import { AppError } from '~/lib/error-utils.server';

export const getValidPriceTier = (priceTierId?: string): PriceTier | undefined => {
    if (!priceTierId) {
        return undefined;
    }
    const isValidPriceTierId = PriceTierIdSchema.safeParse(priceTierId).success;

    if (!isValidPriceTierId) {
        return undefined;
    }

    const candidate = priceTiers[priceTierId as PriceTierId];

    if (!candidate) {
        return undefined;
    }

    if (!candidate.isPublic) {
        return undefined;
    }

    return candidate;
};

export const getValidFreePriceTier = (priceTierId?: string): PriceTier | undefined => {
    const candidate = getValidPriceTier(priceTierId);
    if (!candidate || candidate.monthlyUsdPrice > 0) {
        return undefined;
    }
    return candidate;
};

export const getValidPaidPriceTier = (priceTierId?: string): PriceTier | undefined => {
    const candidate = getValidPriceTier(priceTierId);
    if (!candidate || candidate.monthlyUsdPrice === 0) {
        return undefined;
    }
    return candidate;
};

export const isPriceTierId = (value?: string): value is PriceTierId => {
    if (!value) {
        return false;
    }
    const isValidValue = PriceTierIdSchema.safeParse(value).success;

    if (!isValidValue) {
        return false;
    }

    return priceTiers[value as PriceTierId].isPublic;
};

// TODO revisit throw
export function isFreePriceTier(priceTierId: PriceTierId): boolean {
    if (!priceTiers[priceTierId]) {
        throw new AppError({
            internalMessage: `PriceTierId ${priceTierId} is not defined`,
        });
    }
    if (priceTiers[priceTierId].isPublic !== true) {
        throw new AppError({
            internalMessage: `PriceTierId ${priceTierId} is not public`,
        });
    }
    return priceTiers[priceTierId].monthlyUsdPrice === 0;
}

export function isPaidPriceTier(priceTierId: PriceTierId): boolean {
    if (!priceTiers[priceTierId]) {
        throw new AppError({
            internalMessage: `PriceTierId ${priceTierId} is not defined`,
        });
    }
    if (priceTiers[priceTierId].isPublic !== true) {
        throw new AppError({
            internalMessage: `PriceTierId ${priceTierId} is not public`,
        });
    }
    return priceTiers[priceTierId].monthlyUsdPrice > 0;
}

export function getPriceTierChangeScenario(
    fromPriceTierId: PriceTierId,
    toPriceTierId: PriceTierId,
): PriceTierChangeScenario | undefined {
    const from = priceTiers[fromPriceTierId];
    const to = priceTiers[toPriceTierId];

    if (isFreePriceTier(from.id) && isPaidPriceTier(to.id)) {
        return 'free-to-paid';
    }

    if (isFreePriceTier(from.id) && isFreePriceTier(to.id)) {
        return 'free-to-free';
    }

    if (isPaidPriceTier(from.id) && isFreePriceTier(to.id)) {
        return 'paid-to-free';
    }

    if (isPaidPriceTier(from.id) && isPaidPriceTier(to.id)) {
        return to.monthlyUsdPrice < from.monthlyUsdPrice ? 'paid-to-paid-downgrade' : 'paid-to-paid-upgrade';
    }
}
