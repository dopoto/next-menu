// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from "~/env";

const fileName = "sentry.edge.config.ts";
if (env.NEXT_PUBLIC_LOG_TO_SENTRY !== "yes") {
  // eslint-disable-next-line no-console
  console.log(
    `${fileName}: skipping Sentry init - NEXT_PUBLIC_LOG_TO_SENTRY is not set to 'yes'.`,
  );
} else {
  void Promise.all([
    import("@sentry/nextjs"),
    import("./sentry.common.config"),
  ]).then(([Sentry, { commonSentryOptions }]) => {
    Sentry.init({ ...commonSentryOptions });
  });
}
