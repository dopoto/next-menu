export const menuModeValues = ['noninteractive', 'interactive', 'postpaid', 'prepaid'] as const;
export type MenuModeId = (typeof menuModeValues)[number];

export type MenuMode = {
    id: MenuModeId;
    name: string;
    description: string;
    allowsAddToOrder: boolean;
    isEnabled: boolean;
};

export const MENU_MODES: Record<MenuModeId, MenuMode> = {
    noninteractive: {
        id: 'noninteractive',
        name: 'Non-interactive',
        description: 'Customers can use your menus to browse, filter, search and view your menu items.',
        allowsAddToOrder: false,
        isEnabled: true,
    },
    interactive: {
        id: 'interactive',
        name: 'Interactive',
        description:
            'Customers can use your menus to create orders and track delivered items in real time, but they will not be able to pay through the app.',
        allowsAddToOrder: true,
        isEnabled: true,
    },
    postpaid: {
        id: 'postpaid',
        name: 'Post-paid',
        description:
            'Customers can use your menus to create orders, track delivered items in real time and pay their bill through the app.',
        allowsAddToOrder: true,
        isEnabled: false,
    },
    prepaid: {
        id: 'prepaid',
        name: 'Pre-paid',
        description:
            'Customers can use your menus to create orders and track delivered items in real time. They will be required to pay for items beforehand.',
        allowsAddToOrder: true,
        isEnabled: false,
    },
};
