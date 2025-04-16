import { type MenuItemId } from '~/lib/menu-items';
import type { PriceTierId } from '../app/_domain/price-tiers';
import { type LocationId, type LocationSlug } from '../app/u/[locationId]/_domain/locations';

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
    onboardCreateOrg: '/onboard/create-org',
    onboardAddLocation: '/onboard/add-location',
    onboardPayment: '/onboard/payment',
    onboardOverview: '/onboard/overview',

    // AUTH_PROTECTED
    my: '/my',
    userRoot: '/u',
    location: (locationId: LocationId) => `/u/${locationId}/location`,
    live: (locationId: LocationId) => `/u/${locationId}/live`,
    reports: (locationId: LocationId) => `/u/${locationId}/reports`,
    menus: (locationId: LocationId) => `/u/${locationId}/menus`,
    menusAdd: (locationId: LocationId) => `/u/${locationId}/menus/add`,
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
