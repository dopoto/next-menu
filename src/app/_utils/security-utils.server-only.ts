import { auth } from '@clerk/nextjs/server';
import 'server-only';
import { type LocationId } from '~/app/u/[locationId]/_domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { getLocation } from '~/server/queries/location';

/**
 * Checks if the user is authenticated and returns the user ID.
 * Throws an error if the user is not authenticated.
 * @returns The user ID of the authenticated user.
 */
export async function validateUserOrThrow(): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }
    return userId;
}

/**
 * Checks if the claims contain an Org Id and returns the Org Id.
 * Throws an error if the  Org Id is missing.
 * @returns The Org Id.
 */
export async function validateOrganizationOrThrow(): Promise<string> {
    const { sessionClaims } = await auth();
    const orgId = sessionClaims?.org_id;
    if (!orgId) {
        throw new AppError({ internalMessage: 'No organization ID found' });
    }
    return orgId;
}

/**
 * Checks if the the location belongs to the organization the user is in.
 * Throws an error if that's not the case.
 * @returns The valid Location Id.
 */
export async function validateLocationOrThrow(
    locationId: LocationId,
    organizationId: string,
    userId: string,
): Promise<LocationId> {
    const validLocationId = await getLocation(locationId, organizationId, userId);
    if (!validLocationId) {
        const internalMessage = `Location not found. Location ID: ${locationId}, Org ID: ${organizationId}, User ID: ${userId}`;
        throw new AppError({ internalMessage });
    }
    return validLocationId;
}
