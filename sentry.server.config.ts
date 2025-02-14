// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://92525d00952347560e5c0d0825571112@o4508817729191936.ingest.de.sentry.io/4508817736007760",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
