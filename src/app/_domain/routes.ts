import type { PriceTierId } from "./price-tiers";

type PlanChangeType =
  | "free-to-paid"
  | "free-to-free"
  | "paid-to-free"
  | "paid-to-paid"
  | "upgrade"
  | "downgrade";

export const ROUTES = {
  home: "/",
  my: "/my",

  // SIGN-IN / SIGN UP
  signUp: "/sign-up",
  signUpForPriceTier: (tier?: PriceTierId) => `/sign-up?tier=${tier}`,
  signIn: "/sign-in",
  signOut: "/sign-out",

  // ONBOARD
  onboardSelectPlan: "/onboard/select-plan",
  onboardCreateOrg: "/onboard/create-org",
  onboardAddLocation: "/onboard/add-location",
  onboardPayment: "/onboard/payment",
  onboardOverview: "/onboard/payment",

  // MANAGE
  //manager: (locationId: LocationId) => `/manage/${locationId}`,
  live: "live", // TODO
  reports: "reports", // TODO
  menus: "menus", // TODO
  menusAdd: "menus/add", // TODO

  // PLAN
  changePlan: "/plan/change",
  changePlanTo: (priceTierId?: PriceTierId) => `/plan/change/${priceTierId}`,
  changePlanToPlan: (
    planChangeType: PlanChangeType,
    priceTierId?: PriceTierId,
  ) => `/plan/change/${planChangeType}?toTierId=${priceTierId}`,
  viewPlan: "/plan/view",
} as const;

export type ApplicationRoute = (typeof ROUTES)[keyof typeof ROUTES];
