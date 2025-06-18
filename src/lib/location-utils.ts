import { api } from 'convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { LOCATION_SLUG_LENGTH, type LocationId, locationIdSchema, LocationSlug } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { generateRandomSlug } from '~/lib/string-utils';

export function getValidLocationIdOrThrow(candidate?: string | number): LocationId {
    const parsedLocationId = getValidLocationId(candidate);
    if (parsedLocationId == null) {
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(candidate)}`,
        });
    }
    return parsedLocationId;
}

export function getValidLocationId(candidate?: string | number): LocationId | null {
    if (!candidate) {
        return null;
    }

    const locationValidationResult = locationIdSchema.safeParse(candidate);
    if (!locationValidationResult.success) {
        return null;
    }

    const parsedlocationId = locationValidationResult.data;
    return parsedlocationId;
}

/**
 * Generates a unique random slug for a location.
 * Retries with a new slug if the generated one already exists.
 * @returns A unique location slug.
 */
export async function generateUniqueLocationSlug(): Promise<LocationSlug> {
    while (true) {
        const slug = generateRandomSlug(LOCATION_SLUG_LENGTH);
        const existingLocation = (await fetchQuery(api.locations.getLocationBySlug, { slug }));
        if (!existingLocation) {
            return slug;
        }
    }
}
