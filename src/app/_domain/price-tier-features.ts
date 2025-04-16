import { z } from 'zod';

export const PriceTierFeatureIdSchema = z.union([z.literal('locations'), z.literal('menus'), z.literal('menuItems')]);
export type PriceTierFeatureId = z.infer<typeof PriceTierFeatureIdSchema>;

type PriceTierFeature = {
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

export const priceTierFeatures: Record<PriceTierFeatureId, PriceTierFeature> = {
    locations: {
        id: 'locations',
        resourceSingularName: 'location',
        resourcePluralName: 'locations',
    },
    menus: {
        id: 'menus',
        resourceSingularName: 'menu',
        resourcePluralName: 'menus',
    },
    menuItems: {
        id: 'menuItems',
        resourceSingularName: 'menu item',
        resourcePluralName: 'menu items',
    },
};
