import { type LocationSlug } from '~/domain/locations';
import { type OrganizationId } from '~/lib/organization';

/**
 * NOTE: Each field (E.G. "orgId", "locationSlug") needs to be configured
 * in the associated Google Tag Manager container:
 * - defined as a Data Layer Variable
 * - added as an Event Parameter in the GA4 event
 */
export interface AnalyticsEventMap {
    /**
     * Fired when the /p/[locationSlug] is accessed.
     */
    publicLocationVisit: {
        orgId: OrganizationId;
        locationSlug: LocationSlug;
    };
}

export type AnalyticsEventId = keyof AnalyticsEventMap;

export interface AnalyticsEventSenderProps<T extends AnalyticsEventId> {
    eventId: T;
    payload: AnalyticsEventMap[T];
}
