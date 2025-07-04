import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import { env } from '~/env';

/**
 * @see https://clerk.com/docs/security/clerk-csp.
 * @see https://docs.stripe.com/security/guide#content-security-policy
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.js.stripe.com https://js.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://*.googletagmanager.com https://va.vercel-scripts.com/v1/script.debug.js https://upload-widget.cloudinary.com/global/all.js;
    script-src-elem 'self' 'unsafe-inline' https://checkout.stripe.com https://js.stripe.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://www.googletagmanager.com https://va.vercel-scripts.com/v1/script.debug.js https://upload-widget.cloudinary.com/global/all.js;
    style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.stripe.com https://img.clerk.com https://*.google-analytics.com https://*.googletagmanager.com https://fonts.gstatic.com https://res.cloudinary.com;
    font-src 'self';
    frame-src https://checkout.stripe.com https://*.js.stripe.com https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://upload-widget.cloudinary.com;
    object-src ${process.env.NODE_ENV !== 'development' ? "'self' data:;" : "'none';"}
    worker-src 'self' blob: ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN};
    connect-src 'self' https://checkout.stripe.com https://api.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://clerk-telemetry.com/v1/event https://*.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com wss://ws-eu.pusher.com/app/${env.NEXT_PUBLIC_PUSHER_APP_KEY} https://sockjs-eu.pusher.com/pusher/app/${env.NEXT_PUBLIC_PUSHER_APP_KEY}*;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    ${env.NEXT_PUBLIC_CSP_REPORT_URI ? `report-uri ${env.NEXT_PUBLIC_CSP_REPORT_URI}` : ''}
`;

const nextConfig: NextConfig = {
    experimental: {
        // TODO dynamicIO
    },

    // See https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#debugging-cached-data-in-local-development.
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    typescript: {
        ignoreBuildErrors: true,
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    transpilePackages: ['@opentelemetry/instrumentation', 'import-in-the-middle', 'require-in-the-middle'],

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
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
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: `/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: '/ingest/static/:path*',
                destination: 'https://eu-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://eu.i.posthog.com/:path*',
            },
            {
                source: '/ingest/decide',
                destination: 'https://eu.i.posthog.com/decide',
            },
        ];
    },

    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
};

const config =
    env.NEXT_PUBLIC_LOG_TO_SENTRY === 'yes'
        ? withSentryConfig(nextConfig, {
              // For all available options, see:
              // https://github.com/getsentry/sentry-webpack-plugin#options

              org: env.NEXT_PUBLIC_SENTRY_ORG,
              project: env.NEXT_PUBLIC_SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN, // Required for source map validation

              // Only print logs for uploading source maps in CI
              silent: !process.env.CI,

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

              sourcemaps: {
                  disable: false,
                  deleteSourcemapsAfterUpload: true,
              },
          })
        : nextConfig;

module.exports = config;
