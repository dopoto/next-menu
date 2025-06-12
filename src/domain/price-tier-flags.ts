import { z } from 'zod';
import { MENU_MODES } from '~/domain/menu-modes';

export const PriceTierFlagIdSchema = z.union([
    z.literal('reports'),
    z.literal('publicSite'),
    z.literal('nonInteractiveMode'),
    z.literal('interactiveMode'),
]);

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
        description: 'A public-facing professional-looking web page that your customers can use to browse your menus.',
    },
    nonInteractiveMode: {
        id: 'nonInteractiveMode',
        resourceSingularName: 'non-interactive mode',
        resourcePluralName: 'non-interactive mode',
        description: MENU_MODES.noninteractive.description,
    },
    interactiveMode: {
        id: 'interactiveMode',
        resourceSingularName: 'interactive mode',
        resourcePluralName: 'interactive mode',
        description: MENU_MODES.interactive.description,
    },
};
