import { ExceededFeature } from "../_domain/price-tier-features";
import {
  priceTiers,
  type PriceTierId,
} from "../_domain/price-tiers";
import { getAvailableQuota } from "./quota-utils.server-only";

export async function getExceededFeatures(
  currentTierId: PriceTierId,
  candidateTierId: PriceTierId,
): Promise<Array<ExceededFeature>> {
  const featuresInCurrentTierWithUsage = await Promise.all(
    priceTiers[currentTierId].features.map(async (feature) => {
      const available = await getAvailableQuota(feature.id);
      const candidateQuota =
        priceTiers[candidateTierId].features.find((cf) => cf.id === feature.id)
          ?.quota ?? 0;
      return {
        id: feature.id,
        planQuota: feature.quota,
        available,
        used: feature.quota - available,
        candidateQuota,
      };
    }),
  );

  return featuresInCurrentTierWithUsage.filter(
    (f) => f.candidateQuota < f.used,
  );
}
