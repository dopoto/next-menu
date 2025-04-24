import { type PriceTierFeatureId } from '~/domain/price-tier-features';
import { getLocationsPlanUsage, getMenuItemsPlanUsage, getMenusPlanUsage } from '~/server/queries';

export type PriceTierFeatureUsage = {
    id: PriceTierFeatureId;
    planQuota: number;
    used: number;
    available: number;
};

export const priceTierUsageFunctions: Record<PriceTierFeatureId, () => Promise<number>> = {
    locations: getLocationsPlanUsage,
    menus: getMenusPlanUsage,
    menuItems: getMenuItemsPlanUsage,
};

export type ExceededFeature = PriceTierFeatureUsage & {
    candidateQuota?: number;
};
