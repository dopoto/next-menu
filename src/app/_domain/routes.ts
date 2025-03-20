import { LocationId } from "../[locationId]/_domain/locations";
import type { PriceTierId } from "./price-tiers";



export const ROUTES = {
    home: '/',
    my: '/my',


    // SIGN UP
    signUp: '/sign-up',
    signUpForPriceTier: (tier?: PriceTierId) => `/sign-up?tier=${tier}`,

    // ONBOARD
    onboardSelectPlan: '/onboard/select-plan',
    onboardCreateOrg: '/onboard/create-org',
    onboardAddLocation: '/onboard/add-location',
    onboardPayment: '/onboard/payment',
    onboardOverview: '/onboard/payment',
    
    // MANAGE
    //manager: (locationId: LocationId) => `/manage/${locationId}`,
    manageRelativeMenusAdd: 'manage/menus/add',

    // PLAN
    changePlan: '/change-plan',
    changePlanTo: (tierId?: PriceTierId) => `/change-plan?tier=${tierId}`,
    viewPlan: '/view-plan',
    signIn: '/sign-in',

    signOut: '/sign-out',
  } as const;

  export type ApplicationRoute = (typeof ROUTES)[keyof typeof ROUTES];