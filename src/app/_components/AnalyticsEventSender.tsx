"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import {
  type AnalyticsEventSenderProps,
  type AnalyticsEventId,
} from "~/domain/analytics";
import posthog from "posthog-js";

export function AnalyticsEventSender<T extends AnalyticsEventId>({
  eventId,
  payload,
}: AnalyticsEventSenderProps<T>) {
  // Send Google Tag manager (GTM) event
  useEffect(() => {
    sendGTMEvent({
      event: "custom_event",
      eventId,
      ...payload,
    });
  }, [eventId, payload]);

  // Send PostHog event
  useEffect(() => {
    posthog.debug();
    posthog.capture(eventId, { ...payload });
  }, [eventId, payload]);

  return null;
}
