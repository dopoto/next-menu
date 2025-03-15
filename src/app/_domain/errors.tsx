import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#using-error-boundaries.
 */
export type ErrorBoundaryException = Error & { digest?: string };

export type ErrorTypeId =
  | "STRIPE_MISSING_PAYMENT_DATA"
  | "STRIPE_PAYMENT_EXPIRED"
  | "STRIPE_PAYMENT_UNKNOWN_STATUS"
  | "STRIPE_PAYMENT_ERROR"
  | "CHANGE_PLAN_ERROR"
  | "VIEW_PLAN_ERROR"
  | "MENUS_INVALID_PARAM"
  | "ORDERS_INVALID_PARAM";

type ErrorCta = {
  text: string;
  href: string;
};

export type ApplicationError = {
  errorTypeId: ErrorTypeId;
  userFriendlyTitle: string;
  userFriendlyDescription: string;
  ctas?: ErrorCta[];
};

export const errorTypes: Record<ErrorTypeId, ApplicationError> = {
  STRIPE_MISSING_PAYMENT_DATA: {
    errorTypeId: "STRIPE_MISSING_PAYMENT_DATA",
    userFriendlyTitle: "Missing Stripe payment data",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [], // dynamic cta provided at runtime
  },
  STRIPE_PAYMENT_EXPIRED: {
    errorTypeId: "STRIPE_PAYMENT_EXPIRED",
    userFriendlyTitle: "Stripe payment expired",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [], // dynamic cta provided at runtime
  },
  STRIPE_PAYMENT_UNKNOWN_STATUS: {
    errorTypeId: "STRIPE_PAYMENT_UNKNOWN_STATUS",
    userFriendlyTitle: "Stripe payment status error",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [], // dynamic cta provided at runtime
  },
  STRIPE_PAYMENT_ERROR: {
    errorTypeId: "STRIPE_PAYMENT_ERROR",
    userFriendlyTitle: "Stripe payment error",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [], // dynamic cta provided at runtime
  },
  CHANGE_PLAN_ERROR: {
    errorTypeId: "CHANGE_PLAN_ERROR",
    userFriendlyTitle: "An error occurred while changing your plan",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [
      { text: "Start over", href: "/change-plan" },
      { text: "Go back to my account", href: "/my" },
    ],
  },
  VIEW_PLAN_ERROR: {
    errorTypeId: "CHANGE_PLAN_ERROR",
    userFriendlyTitle: "An error occurred while changing your plan",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [
      { text: "Start over", href: "/change-plan" },
      { text: "Go back to my account", href: "/my" },
    ],
  },
  ORDERS_INVALID_PARAM: {
    errorTypeId: "ORDERS_INVALID_PARAM",
    userFriendlyTitle: "Could not load orders data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [{ text: "Go back to my account", href: "/my" }],
  },
  MENUS_INVALID_PARAM: {
    errorTypeId: "MENUS_INVALID_PARAM",
    userFriendlyTitle: "Could not load menus data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [{ text: "Go back to my account", href: "/my" }],
  },
};
