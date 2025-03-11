import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

/**
 * Custom error class that supports additional context data
 * This allows you to throw errors with structured metadata
 * that can be accessed in error boundaries
 */
export class ContextError extends Error {
  context: Record<string, unknown>;
  digest?: string;

  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ContextError';
    this.context = context;
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, ContextError.prototype);
  }

  /**
   * Helper method to convert the error to a plain object
   * Useful for logging or serializing the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      stack: this.stack
    };
  }
}

/**
 * Helper function to check if an error is a ContextError
 */
export function isContextError(error: unknown): error is ContextError {
  return error instanceof ContextError;
}

export type ErrorTypeId =
  | "STRIPE_MISSING_PAYMENT_DATA"
  | "STRIPE_PAYMENT_EXPIRED"
  | "STRIPE_PAYMENT_UNKNOWN_STATUS"
  | "STRIPE_PAYMENT_ERROR"
  | "CHANGE_PLAN_ERROR"
  | "MENUS_INVALID_PARAM"
  | "ORDERS_INVALID_PARAM";

export type Error = {
  errorTypeId: ErrorTypeId;
  userFriendlyTitle: string;
  userFriendlyDescription: string;
  ctas?: ReactNode[];
};

export const errorTypes: Record<ErrorTypeId, Error> = {
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
      <Link key="change" href="/change-plan">
        <Button>Start over</Button>
      </Link>,
      <Link key="home" href="/my">
        <Button>Return to my dashboard</Button>
      </Link>,
    ],
  },
  ORDERS_INVALID_PARAM: {
    errorTypeId: "ORDERS_INVALID_PARAM",
    userFriendlyTitle: "Could not load orders data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [
      <Link key="home" href="/my">
        <Button>Return to my dashboard</Button>
      </Link>,
    ],
  },
  MENUS_INVALID_PARAM: {
    errorTypeId: "MENUS_INVALID_PARAM",
    userFriendlyTitle: "Could not load menus data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [
      <Link key="home" href="/my">
        <Button>Return to my dashboard</Button>
      </Link>,
    ],
  },
};
