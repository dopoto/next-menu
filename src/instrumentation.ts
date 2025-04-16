import * as Sentry from '@sentry/nextjs';
import { env } from './env';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs' && env.NEXT_PUBLIC_LOG_TO_SENTRY === 'yes') {
        await import('../sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME && env.NEXT_PUBLIC_LOG_TO_SENTRY === 'yes') {
        await import('../sentry.edge.config');
    }
}

export const onRequestError = Sentry.captureRequestError;
