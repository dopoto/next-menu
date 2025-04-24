import { type ExceededFeature } from '../../domain/price-tier-usage';
import { priceTiers, type PriceTierId } from '../../domain/price-tiers';
import { getAvailableFeatureQuota } from './quota-utils.server-only';

export async function getExceededFeatures(
    currentTierId: PriceTierId,
    candidateTierId: PriceTierId,
): Promise<Array<ExceededFeature>> {
    const featuresInCurrentTierWithUsage = await Promise.all(
        priceTiers[currentTierId].features.map(async (feature) => {
            const available = await getAvailableFeatureQuota(feature.id);
            const candidateQuota = priceTiers[candidateTierId].features.find((cf) => cf.id === feature.id)?.quota ?? 0;
            return {
                id: feature.id,
                planQuota: feature.quota,
                available,
                used: feature.quota - available,
                candidateQuota,
            };
        }),
    );

    return featuresInCurrentTierWithUsage.filter((f) => f.candidateQuota < f.used);
}
