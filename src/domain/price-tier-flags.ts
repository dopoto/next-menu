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
};

export const priceTierFlags: Record<PriceTierFlagId, PriceTierFlag> = {
    reports: {
        id: 'reports',
        resourceSingularName: 'report',
        resourcePluralName: 'reports',
    },
    publicSite: {
        id: 'publicSite',
        resourceSingularName: 'public site',
        resourcePluralName: 'public site',
    },
};
