"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import {
  AnalyticsEventSenderProps,
  AnalyticsEventId,
} from "~/domain/analytics";

export function AnalyticsEventSender<T extends AnalyticsEventId>({
  eventId,
  payload,
}: AnalyticsEventSenderProps<T>) {
  useEffect(() => {
    sendGTMEvent({
      event: "custom_event",
      eventId,
      ...payload,
    });
  }, []);
  return null;
}
