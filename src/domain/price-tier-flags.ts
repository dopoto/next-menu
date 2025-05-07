import { z } from 'zod';

export const PriceTierFlagIdSchema = z.union([z.literal('reports'), z.literal('publicSite')]);

export type PriceTierFlagId = z.infer<typeof PriceTierFlagIdSchema>;

export type PriceTierFlag = {
    id: PriceTierFlagId;
    /**
     * @example "report"
     */
    resourceSingularName: string;
    /**
     * @example "reports"
     */
    resourcePluralName: string;
    description: string;
};

export const priceTierFlags: Record<PriceTierFlagId, PriceTierFlag> = {
    reports: {
        id: 'reports',
        resourceSingularName: 'report',
        resourcePluralName: 'reports',
        description:
            'Visualize, filter and process in-depth data - visitors, orders, menu items break-downs and much more.',
    },
    publicSite: {
        id: 'publicSite',
        resourceSingularName: 'public site',
        resourcePluralName: 'public site',
        description: 'A public-facing professional-looking web site that your customers can use to browse your menus.',
    },
};
