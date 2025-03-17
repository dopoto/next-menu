// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from "~/env";

const fileName = "sentry.server.config.ts";
if (env.NEXT_PUBLIC_LOG_TO_SENTRY !== "true") {
  console.log(
    `${fileName}: skipping Sentry init - NEXT_PUBLIC_LOG_TO_SENTRY is not set to true.`,
  );
} else {
  void Promise.all([
    import("@sentry/nextjs"),
    import("./sentry.common.config"),
  ]).then(([Sentry, { commonSentryOptions }]) => {
    Sentry.init({ ...commonSentryOptions });
  });
}
