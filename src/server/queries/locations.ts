import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import 'server-only';
import { type z } from 'zod';
import {
    LOCATION_SLUG_LENGTH,
    type Location,
    type LocationId,
    type LocationSlug,
    type locationFormSchema,
} from '~/domain/locations';
import { getValidClerkOrgIdOrThrow } from '~/lib/clerk-utils';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { db } from '~/server/db';
import { locations, organizations } from '~/server/db/schema';

/**
 * Generates a random string of specified length using letters and numbers
 */
function generateRandomSlug(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generates a unique random slug for a location.
 * Retries with a new slug if the generated one already exists.
 * @returns A unique location slug
 */
export async function generateUniqueLocationSlug(): Promise<LocationSlug> {
    while (true) {
        // Generate a fixed-character random string
        const slug = generateRandomSlug(LOCATION_SLUG_LENGTH);

        // Check if this slug already exists
        const existingLocation = await db.query.locations.findFirst({
            where: (locations, { eq }) => eq(locations.slug, slug),
        });

        // If no location with this slug exists, return it
        if (!existingLocation) {
            return slug;
        }
        // If slug exists, the while loop will continue and try another one
    }
}

/**
 * Returns the location, if it's found in the db and if it belongs to
 * the org of the current user. Throws an error if that's not the case.
 * @param locationId
 * @returns A valid Location.
 */
export async function getLocationForCurrentUserOrThrow(locationId: string | number): Promise<Location> {
    const validLocationId = getValidLocationIdOrThrow(locationId);

    const { userId, orgId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized - no user ID provided' });
    }

    const validClerkOrgId = getValidClerkOrgIdOrThrow(orgId);

    const location = await db.query.locations.findFirst({
        where: (locations, { and, eq }) =>
            and(
                eq(locations.id, validLocationId),
                eq(
                    locations.orgId,
                    db
                        .select({ id: organizations.id })
                        .from(organizations)
                        .where(eq(organizations.clerkOrgId, validClerkOrgId))
                        .limit(1),
                ),
            ),
    });

    if (!location) {
        throw new AppError({
            internalMessage: `Location not found or access denied. Location ID: ${locationId}, Clerk Org ID: ${validClerkOrgId}, User ID: ${userId}`,
        });
    }

    return {
        ...location,
        menuMode: location.menuMode as Location['menuMode'],
        currencyId: location.currencyId as Location['currencyId'],
    };
}

export async function getLocationPublicDataBySlug(locationSlug: LocationSlug): Promise<Location> {
    const location = await db.query.locations.findFirst({
        where: (locations, { eq }) => eq(locations.slug, locationSlug),
    });

    if (!location) {
        throw new AppError({
            internalMessage: `Location not found for slug ${locationSlug}.`,
        });
    }

    return {
        ...location,
        menuMode: location.menuMode as Location['menuMode'],
        currencyId: location.currencyId as Location['currencyId'],
    };
}

export async function getLocationPublicDataById(locationId: LocationId): Promise<Location> {
    const location = await db.query.locations.findFirst({
        where: (locations, { eq }) => eq(locations.id, locationId),
    });

    if (!location) {
        throw new AppError({
            internalMessage: `Location not found for id ${locationId}.`,
        });
    }

    return {
        ...location,
        menuMode: location.menuMode as Location['menuMode'],
        currencyId: location.currencyId as Location['currencyId'],
    };
}

export async function updateLocation(locationId: LocationId, data: z.infer<typeof locationFormSchema>) {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    await db.transaction(async (tx) => {
        const result = await tx
            .update(locations)
            .set({
                name: data.locationName,
                currencyId: data.currencyId,
                menuMode: data.menuMode,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .where(eq(locations.id, validLocation.id));

        if (result.rowCount === 0) {
            const internalMessage = `Location with ID ${locationId} not found or not authorized for update`;
            throw new AppError({ internalMessage });
        }
    });
}
