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
    location: (slug: LocationSlug) => `/u/${slug}/location`,
    live: (slug: LocationSlug) => `/u/${slug}/live`,
    reports: (slug: LocationSlug) => `/u/${slug}/reports`,
    menus: (slug: LocationSlug) => `/u/${slug}/menus`,
    menusAdd: (slug: LocationSlug) => `/u/${slug}/menus/add`,
    menusEdit: (slug: LocationSlug, menuId: MenuId) => `/u/${slug}/menus/edit/${menuId}`,
    menuItems: (slug: LocationSlug) => `/u/${slug}/menu-items`,
    menuItemsAdd: (slug: LocationSlug) => `/u/${slug}/menu-items/add`,
    menuItemsEdit: (slug: LocationSlug, menuItemId: MenuItemId) => `/u/${slug}/menu-items/edit/${menuItemId}`,

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
