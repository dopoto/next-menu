import { withSentryConfig } from "@sentry/nextjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { type NextConfig } from "next";
import { env } from "~/env";

/**
 * @see https://clerk.com/docs/security/clerk-csp.
 * @see https://docs.stripe.com/security/guide#content-security-policy
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.js.stripe.com https://js.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://www.googletagmanager.com;
    script-src-elem 'self' 'unsafe-inline' https://checkout.stripe.com https://js.stripe.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.stripe.com https://img.clerk.com https://www.googletagmanager.com;
    font-src 'self';
    frame-src https://checkout.stripe.com https://*.js.stripe.com https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com;
    object-src ${process.env.NODE_ENV !== 'development' ? "'self' data:;" : "'none';"}
    worker-src 'self' blob: ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN};
    connect-src 'self' https://checkout.stripe.com https://api.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://clerk-telemetry.com/v1/event https://*.sentry.io https://*.google-analytics.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    ${env.NEXT_PUBLIC_CSP_REPORT_URI ? `report-uri: ${env.NEXT_PUBLIC_CSP_REPORT_URI}` : "" }
`;

const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        search: '',
      },
    ],
  },

  webpack: (config: { cache: { type: string } }) => {
    config.cache = {
      type: "memory",
    };

    return config;
  },
};

export default withSentryConfig(config, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "dopoto",
  project: "next-menu",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI, //TODO use env instead

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
