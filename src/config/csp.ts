import { env } from "../env"



/**
 * @see https://clerk.com/docs/security/clerk-csp.
 * @see https://docs.stripe.com/security/guide#content-security-policy
 */
export const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.js.stripe.com https://js.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://*.googletagmanager.com https://va.vercel-scripts.com/v1/script.debug.js https://upload-widget.cloudinary.com/global/all.js;
    script-src-elem 'self' 'unsafe-inline' https://checkout.stripe.com https://js.stripe.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://challenges.cloudflare.com https://www.googletagmanager.com https://va.vercel-scripts.com/v1/script.debug.js https://upload-widget.cloudinary.com/global/all.js;
    style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.stripe.com https://img.clerk.com https://*.google-analytics.com https://*.googletagmanager.com https://fonts.gstatic.com https://res.cloudinary.com;
    font-src 'self';
    frame-src https://checkout.stripe.com https://*.js.stripe.com https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://upload-widget.cloudinary.com;
    object-src ${process.env.NODE_ENV !== 'development' ? "'self' data:;" : "'none';"}
    worker-src 'self' blob: ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN};
    connect-src 'self' https://checkout.stripe.com https://api.stripe.com https://maps.googleapis.com ${env.NEXT_PUBLIC_CLERK_SUBDOMAIN} https://clerk-telemetry.com/v1/event https://*.sentry.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com wss://ws-eu.pusher.com/app/${env.NEXT_PUBLIC_PUSHER_APP_KEY} https://sockjs-eu.pusher.com/pusher/app/${env.NEXT_PUBLIC_PUSHER_APP_KEY} wss://proficient-ostrich-620.convex.cloud/api/;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    ${env.NEXT_PUBLIC_CSP_REPORT_URI ? `report-uri ${env.NEXT_PUBLIC_CSP_REPORT_URI}` : ''}
`;