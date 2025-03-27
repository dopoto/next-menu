import { z } from "zod";
import { getLocationsPlanUsage, getMenusPlanUsage } from "~/server/queries";

export const PriceTierFeatureIdSchema = z.union([
  z.literal("locations"),
  z.literal("menus"),
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
  planQuota: number;
  used: number;
  available: number;
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
};

export const priceTierUsageFunctions: Record<
  PriceTierFeatureId,
  () => Promise<number>
> = {
  locations: getLocationsPlanUsage,
  menus: getMenusPlanUsage,
};

export type ExceededFeature = PriceTierFeatureUsage & {
  candidateQuota?: number;
};
