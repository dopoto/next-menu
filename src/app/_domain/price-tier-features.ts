import { z } from "zod";
import {
  getLocationsPlanUsage,
  getMenuItemsPlanUsage,
  getMenusPlanUsage,
} from "~/server/queries";

export const PriceTierFeatureIdSchema = z.union([
  z.literal("locations"),
  z.literal("menus"),
  z.literal("menuItems"),
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
  menuItems: {
    id: "menuItems",
    resourceSingularName: "menu item",
    resourcePluralName: "menu items",
  },
};

export const priceTierUsageFunctions: Record<
  PriceTierFeatureId,
  () => Promise<number>
> = {
  locations: getLocationsPlanUsage,
  menus: getMenusPlanUsage,
  menuItems: getMenuItemsPlanUsage,
};

export type ExceededFeature = PriceTierFeatureUsage & {
  candidateQuota?: number;
};
