import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PUBLIC_LOG_TO_SENTRY === "true"
  ) {
    await import("../sentry.server.config");
  }

  if (
    process.env.NEXT_RUNTIME &&
    process.env.NEXT_PUBLIC_LOG_TO_SENTRY === "true"
  ) {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
