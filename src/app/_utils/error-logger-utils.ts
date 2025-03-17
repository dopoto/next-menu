import * as Sentry from "@sentry/nextjs";
import { env } from "~/env";
import {
  type ErrorTypeId,
  type ErrorBoundaryException,
} from "../_domain/errors";

export function generateErrorId() {
  return new Date().getTime().toString();
}

export function logException(
  error: ErrorBoundaryException,
  errorTypeId: ErrorTypeId,
  errorClientSideId: string,
) {
  if (env.NEXT_PUBLIC_LOG_TO_CONSOLE) {
    const errorString = `[APP_ERROR] ${error?.toString()}`;
    console.error(errorString);
  }

  if (env.NEXT_PUBLIC_LOG_TO_SENTRY) {
    Sentry.withScope((scope) => {
      scope.setTag("errorTypeId", errorTypeId);
      scope.setTag("errorClientSideId", errorClientSideId);
      if (error.digest) {
        scope.setTag("digest", error.digest);
      }
      scope.setExtra("componentStack", error.stack ?? "No stack trace");
      Sentry.captureException(error);
    });
  }
}
