import React from "react";
import { LocationId, LocationSlug } from "../u/[locationId]/_domain/locations";
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

  // AUTH_PROTECTED
  my: "/my",
  location: (locationId: LocationId) => `/u/${locationId}/location`,
  live: (locationId: LocationId) => `/u/${locationId}/live`,
  reports: (locationId: LocationId) => `/u/${locationId}/reports`,
  menus: (locationId: LocationId) => `/u/${locationId}/menus`,
  menusAdd: (locationId: LocationId) => `/u/${locationId}/menus/add`,

  // PLAN
  changePlan: "/u/plan/change",
  changePlanTo: (priceTierId?: PriceTierId) => `/u/plan/change/${priceTierId}`,
  changePlanToPlan: (
    planChangeType: PlanChangeType,
    priceTierId?: PriceTierId,
  ) => `/u/plan/change/${planChangeType}?toTierId=${priceTierId}`,
  viewPlan: "/u/plan/view",

  // PUBLIC
  public:  `/p`,
  publicLocation: (locationSlug: LocationSlug) => `/p/${locationSlug}`,
} as const;

export type UserRouteFn = (locationId: LocationId) => string;

export type AppRouteKey = (typeof ROUTES)[keyof typeof ROUTES];
export type AppRoute = ValueOf<typeof ROUTES>;

type ValueOf<T> = T[keyof T];
