import { type LocationId, type LocationSlug } from '~/domain/locations';
import { type MenuItemId } from '~/domain/menu-items';
import { type MenuId } from '~/domain/menus';
import { type PriceTierId } from '~/domain/price-tiers';

type PlanChangeType = 'free-to-paid' | 'free-to-free' | 'paid-to-free' | 'paid-to-paid' | 'upgrade' | 'downgrade';

export const ROUTES = {
    home: '/',

    // SIGN-IN / SIGN UP
    signUp: '/sign-up',
    signUpForPriceTier: (tier?: PriceTierId) => `/sign-up?tier=${tier}`,
    signIn: '/sign-in',
    signOut: '/sign-out',

    // ONBOARD
    onboardSelectPlan: '/onboard/select-plan',
    onboardAddOrg: '/onboard/add-org',
    onboardAddLocation: '/onboard/add-location',
    onboardPayment: '/onboard/payment',
    onboardOverview: '/onboard/overview',

    // AUTH_PROTECTED
    my: '/my',
    userRoot: '/u',
    resetState: '/u/reset-state',
    location: (locationId: LocationId) => `/u/${locationId}/location`,
    dashboard: (locationId: LocationId) => `/u/${locationId}/dashboard`,
    openOrders: (locationId: LocationId) => `/u/${locationId}/orders/open`,
    completedOrders: (locationId: LocationId) => `/u/${locationId}/orders/completed`,
    tables: (locationId: LocationId) => `/u/${locationId}/tables`,
    reports: (locationId: LocationId) => `/u/${locationId}/reports`,
    menus: (locationId: LocationId) => `/u/${locationId}/menus`,
    menusAdd: (locationId: LocationId) => `/u/${locationId}/menus/add`,
    menusEdit: (locationId: LocationId, menuId: MenuId) => `/u/${locationId}/menus/edit/${menuId}`,
    menuItems: (locationId: LocationId) => `/u/${locationId}/menu-items`,
    menuItemsAdd: (locationId: LocationId) => `/u/${locationId}/menu-items/add`,
    menuItemsEdit: (locationId: LocationId, menuItemId: MenuItemId) => `/u/${locationId}/menu-items/edit/${menuItemId}`,

    // PLAN
    changePlan: '/u/plan/change',
    changePlanTo: (priceTierId?: PriceTierId) => `/u/plan/change/${priceTierId}`,
    changePlanToPlan: (planChangeType: PlanChangeType, priceTierId?: PriceTierId) =>
        `/u/plan/change/${planChangeType}?toTierId=${priceTierId}`,
    viewPlan: '/u/plan/view',

    // PUBLIC
    public: `/p`,
    publicLocation: (locationSlug: LocationSlug) => `/p/${locationSlug}`,
} as const;

export type UserRouteFn = (locationId: LocationId) => string;

export type AppRouteKey = (typeof ROUTES)[keyof typeof ROUTES];
export type AppRoute = ValueOf<typeof ROUTES>;

type ValueOf<T> = T[keyof T];
