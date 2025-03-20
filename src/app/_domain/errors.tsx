import { ROUTES } from "./routes";

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#using-error-boundaries.
 */
export type ErrorBoundaryException = Error & { digest?: string };

export type ErrorTypeId =
  | "ONBOARD_ERROR"
  | "CHANGE_PLAN_ERROR"
  | "VIEW_PLAN_ERROR"
  | "ORG_MANAGER_ERROR";

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
  ONBOARD_ERROR: {
    errorTypeId: "ONBOARD_ERROR",
    userFriendlyTitle: "Onboard error ",
    userFriendlyDescription: "",
    ctas: [], // dynamic cta provided at runtime TODO Revisit
  },
  CHANGE_PLAN_ERROR: {
    errorTypeId: "CHANGE_PLAN_ERROR",
    userFriendlyTitle: "An error occurred while changing your plan",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [
      { text: "Start over", href: ROUTES.changePlan },
      { text: "Go back to my account", href: "/my" },
    ],
  },
  VIEW_PLAN_ERROR: {
    errorTypeId: "CHANGE_PLAN_ERROR",
    userFriendlyTitle: "An error occurred while changing your plan",
    userFriendlyDescription: "You will need to retry your payment.",
    ctas: [
      { text: "Start over", href: ROUTES.changePlan },
      { text: "Go back to my account", href: "/my" },
    ],
  },
  ORG_MANAGER_ERROR: {
    errorTypeId: "ORG_MANAGER_ERROR",
    userFriendlyTitle: "An error occurred",
    userFriendlyDescription: "",
    ctas: [{ text: "Go to my account", href: "/my" }],
  },
};
