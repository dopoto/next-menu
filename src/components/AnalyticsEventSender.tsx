'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import { useEffect } from 'react';
import { type AnalyticsEventId, type AnalyticsEventSenderProps } from '~/domain/analytics';

export function AnalyticsEventSender<T extends AnalyticsEventId>({ eventId, payload }: AnalyticsEventSenderProps<T>) {
    // Send Google Tag manager (GTM) event
    useEffect(() => {
        sendGTMEvent({
            event: 'custom_event',
            eventId,
            ...payload,
        });
    }, [eventId, payload]);

    // TODO Revisit
    // Getting error [PostHog.js] You must initialize PostHog before calling posthog.capture
    // (prod build only)

    // Send PostHog event
    // useEffect(() => {
    //   if(!posthog){
    //     console.log(`DBG no posthog`)
    //     return;
    //   }
    //   posthog.debug();
    //   console.log(`DBG posthog capture`)
    //   posthog.capture(eventId, { ...payload });
    // }, [posthog, eventId, payload]);

    return null;
}
