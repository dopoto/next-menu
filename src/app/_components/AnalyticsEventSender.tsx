"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

export function AnalyticsEventSender() {
  useEffect(() => {
    sendGTMEvent({
      event: "custom_event",
      eventId: "event2",
      orgId: "orgId1", locationSlug: "locationSlug1" ,
    });
  }, []);
  return null;
}
