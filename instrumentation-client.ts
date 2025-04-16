// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from '~/env';

const fileName = 'sentry.client.config.ts';
if (env.NEXT_PUBLIC_LOG_TO_SENTRY !== 'yes') {
    // eslint-disable-next-line no-console
    console.log(`${fileName}: skipping Sentry init - NEXT_PUBLIC_LOG_TO_SENTRY is not set to true.`);
} else {
    void Promise.all([import('@sentry/nextjs'), import('./sentry.common.config')]).then(
        ([Sentry, { commonSentryOptions }]) => {
            Sentry.init({ ...commonSentryOptions });
        },
    );
}
