import {
  PriceTierFeatureId,
  PriceTierFeature,
} from "~/app/_domain/price-tier-features";

// TODO move back to price-tier-features.ts (moved here as it broke Storybook builds)

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
