import { LocationSlug } from "~/app/u/[locationId]/_domain/locations";

export interface AnalyticsEventMap {
  publicMenuVisit: {
    orgId: string;
    locationSlug: LocationSlug;
  };
  someOtherEvent: {
    orgId: string;
  };
}

export type AnalyticsEventId = keyof AnalyticsEventMap;

export interface AnalyticsEventSenderProps<T extends AnalyticsEventId> {
  eventId: T;
  payload: AnalyticsEventMap[T];
}
