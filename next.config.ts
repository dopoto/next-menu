import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import { cspHeader } from '~/config/csp';
import { env } from '~/env';

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

    webpack: (config, { isServer }) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            'convex/_generated/api': './convex/_generated/api',
        };
        return config;
    },
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
