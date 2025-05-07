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
    description: string;
};

export const priceTierFeatures: Record<PriceTierFeatureId, PriceTierFeature> = {
    locations: {
        id: 'locations',
        resourceSingularName: 'location',
        resourcePluralName: 'locations',
        description:
            'The number of individual places (e.g. restaurants, bars etc) that you can manage within your organization.',
    },
    menus: {
        id: 'menus',
        resourceSingularName: 'menu',
        resourcePluralName: 'menus',
        description: 'The number of total menus you can create across your locations.',
    },
    menuItems: {
        id: 'menuItems',
        resourceSingularName: 'menu item',
        resourcePluralName: 'menu items',
        description: 'The number of menu items you can create (a menu item can be used in multiple menus).',
    },
};
