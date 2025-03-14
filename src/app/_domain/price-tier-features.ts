import { z } from "zod";
import { env } from "~/env";

export const PriceTierFeatureIdSchema = z.union([
  z.literal("locations"),
  z.literal("menus"),
]);

export type PriceTierFeatureId = z.infer<typeof PriceTierFeatureIdSchema>;

export type PriceTierFeature = {
  
  id: PriceTierFeatureId
  /**
   * @example "menu"
   */
  resourceSingularName: string;
  /**
   * @example "menus"
   */
  resourcePluralName: string;
  
}

 
 
export const priceTierFeatures: Record<PriceTierFeatureId, PriceTierFeature> = {
  locations: {
    id: "locations",
    resourceSingularName: "location",
    resourcePluralName: "locations"
  },
  menus: {
    id: "locations",
    resourceSingularName: "menu",
    resourcePluralName: "menus"
  }
};

 