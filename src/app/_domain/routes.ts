import { LocationId } from "../[locationId]/_domain/locations";

export const ROUTES = {
    home: '/',
    changePlan: '/change-plan',
    viewPlan: '/view-plan',
    signIn: '/sign-in',
    signUp: '/sign-up',
    signOut: '/sign-out',
    manager: (locationId: LocationId) => `/manage/${locationId}`,
  } as const;