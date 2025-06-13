import { ArchiveIcon, ChartPie, CircleDashedIcon, FolderCheckIcon, LayoutDashboardIcon, ScanQrCodeIcon, UtensilsCrossedIcon, VaultIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { type AppRouteKey, ROUTES } from '~/lib/routes';

type RouteId =
    | 'ROOT'
    | 'dashboard'
    | 'locationManager'
    | 'live'
    | 'completedOrders'
    | 'tables'
    | 'reports'
    | 'menus'
    | 'menusAdd'
    | 'menuItems'
    | 'menuItemsAdd'
    | 'menuItemsEdit';

export type NavItem = {
    id: RouteId;
    icon?: ReactNode;
    title?: string;
    route?: AppRouteKey;
    children?: NavItem[];
};

export const NAV_ITEMS: Record<RouteId, NavItem> = {
    ROOT: {
        id: 'ROOT',
    },

    locationManager: {
        id: 'locationManager',
    },
    dashboard: {
        id: 'dashboard',
        icon: <LayoutDashboardIcon size={16} />,
        title: 'Dashboard',
        route: ROUTES.dashboard,
    },
    live: {
        id: 'live',
        icon: <CircleDashedIcon size={16} />,
        title: 'Open orders',
        route: ROUTES.live,
    },
    completedOrders: {
        id: 'completedOrders',
        icon: <FolderCheckIcon size={16} />,
        title: 'Completed orders',
        route: ROUTES.completedOrders,
    },
    tables: {
        id: 'tables',
        icon: <VaultIcon size={16} />,
        title: 'Tables',
        route: ROUTES.tables,
    },
    menus: {
        id: 'menus',
        icon: <ScanQrCodeIcon size={16} />,
        title: 'Menus',
        route: ROUTES.menus,
    },
    menusAdd: {
        id: 'menusAdd',
        title: 'Add menu',
        route: ROUTES.menusAdd,
    },
    menuItems: {
        id: 'menuItems',
        icon: <UtensilsCrossedIcon size={16} />,
        title: 'Menu items',
        route: ROUTES.menuItems,
    },
    menuItemsAdd: {
        id: 'menuItemsAdd',
        title: 'Add',
        route: ROUTES.menuItemsAdd,
    },
    menuItemsEdit: {
        id: 'menuItemsEdit',
        title: 'Edit menu item',
        route: ROUTES.menuItemsEdit,
    },
    reports: {
        id: 'reports',
        icon: <ChartPie size={16} />,
        title: 'Reports',
        route: ROUTES.reports,
    },
};

export const NAV_TREE: NavItem = {
    ...NAV_ITEMS.ROOT,
    children: [
        {
            ...NAV_ITEMS.dashboard,
            children: [NAV_ITEMS.dashboard, NAV_ITEMS.live, NAV_ITEMS.completedOrders, NAV_ITEMS.tables],
        },
        {
            ...NAV_ITEMS.locationManager,
            children: [
                {
                    ...NAV_ITEMS.menuItems,
                    children: [NAV_ITEMS.menuItemsAdd],
                },
                {
                    ...NAV_ITEMS.menus,
                    children: [NAV_ITEMS.menusAdd],
                }, NAV_ITEMS.reports
            ],
        },
    ],
};
