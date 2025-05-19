import type { LocationId } from '~/domain/locations';

export const TAGS = {
    locationOpenOrders: (locationId: LocationId) => `location-${locationId}-open-orders`,
};
