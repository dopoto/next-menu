import { PlanChangeOutcome, type ExceededFeature } from "../_domain/price-tier-features";
import { priceTiers, type PriceTierId } from "../_domain/price-tiers";
import { getAvailableQuota } from "./quota-utils.server-only";

export async function getExceededFeatures(
  currentTierId: PriceTierId,
  candidateTierId: PriceTierId,
): Promise<Array<ExceededFeature>> {
  const featuresInCurrentTierWithUsage: ExceededFeature[] = await Promise.all(
    priceTiers[currentTierId].features.map(async (feature) => {
      const available = await getAvailableQuota(feature.id);
      const used =
        typeof feature.quota === "number" && typeof available === "number"
          ? feature.quota - available
          : feature.quota;
      const candidateQuota =
        priceTiers[candidateTierId].features.find((cf) => cf.id === feature.id)
          ?.quota ?? 0;
      return {
        id: feature.id,
        planQuota: feature.quota,
        available,
        used,
        candidateQuota,
        planChangeOutcome: 'ok'  
      };
    }),
  );

  return featuresInCurrentTierWithUsage.filter(
    (f) => {
      if(typeof f.candidateQuota === "boolean" || typeof f.used === "boolean"){
        // // You might go from a plan 
        return false;
      }       
      
      return f.candidateQuota < f.used
    }
  );
}
