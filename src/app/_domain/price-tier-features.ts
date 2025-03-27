import { z } from "zod";
import { getLocationsPlanUsage, getMenusPlanUsage } from "~/server/queries";

export const PriceTierFeatureIdSchema = z.union([
  z.literal("locations"),
  z.literal("menus"),
  z.literal("reports"),
]);

export type PriceTierFeatureId = z.infer<typeof PriceTierFeatureIdSchema>;

export type PriceTierFeature = {
  id: PriceTierFeatureId;
  /**
   * @example "menu"
   */
  resourceSingularName: string;
  /**
   * @example "menus"
   */
  resourcePluralName: string;
};

export type PriceTierFeatureUsage = {
  id: PriceTierFeatureId;
  planQuota: number | boolean;
  used: number | boolean;
  available: number | boolean;
};

export const priceTierFeatures: Record<PriceTierFeatureId, PriceTierFeature> = {
  locations: {
    id: "locations",
    resourceSingularName: "location",
    resourcePluralName: "locations",
  },
  menus: {
    id: "menus",
    resourceSingularName: "menu",
    resourcePluralName: "menus",
  },
  reports: {
    id: "reports",
    resourceSingularName: "report",
    resourcePluralName: "reports",
  },
};

export const priceTierUsageFunctions: Record<
  PriceTierFeatureId,
  () => Promise<number> | null
> = {
  locations: getLocationsPlanUsage,
  menus: getMenusPlanUsage,
  reports: () => {return null}
};

export type ExceededFeature = PriceTierFeatureUsage & {
  candidateQuota?: number | boolean;
  planChangeOutcome: PlanChangeOutcome
};

export type PlanChangeOutcome = 'ok' | 'less-features-warning'  | 'data-loss-error' 
