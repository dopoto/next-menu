import { auth } from '@clerk/nextjs/server';
import 'server-only';
import { getValidClerkOrgIdOrThrow } from '~/domain/clerk';
import { type LocationId, type LocationSlug } from '~/domain/location';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { locations, organizations, type Location, type Menu } from '~/server/db/schema';

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
export async function generateUniqueLocationSlug(): Promise<string> {
    while (true) {
        // Generate an 8-character random string
        const slug = generateRandomSlug(8);

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
export async function getLocation(locationId: LocationId): Promise<Location> {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validClerkOrgId = getValidClerkOrgIdOrThrow(sessionClaims?.org_id);
    if (!validClerkOrgId) {
        throw new AppError({
            internalMessage: `No valid clerk org id found in session claims - ${JSON.stringify(sessionClaims)}.`,
        });
    }

    const location = await db.query.locations.findFirst({
        where: (locations, { and, eq }) =>
            and(
                eq(locations.id, locationId),
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

    return location;
}

export async function getMenusByLocation(locationId: LocationId): Promise<Menu[]> {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validClerkOrgId = getValidClerkOrgIdOrThrow(sessionClaims?.org_id);

    const menus = await db.query.menus.findMany({
        where: (menus, { eq, and }) =>
            and(
                eq(menus.locationId, locationId),
                eq(
                    db
                        .select({ orgId: locations.orgId })
                        .from(locations)
                        .where(
                            and(
                                eq(locations.id, locationId),
                                eq(
                                    locations.orgId,
                                    db
                                        .select({ id: organizations.id })
                                        .from(organizations)
                                        .where(eq(organizations.clerkOrgId, validClerkOrgId))
                                        .limit(1),
                                ),
                            ),
                        )
                        .limit(1),
                    menus.locationId,
                ),
            ),
        orderBy: (menus, { desc }) => desc(menus.name),
    });

    return menus;
}

export async function getLocationPublicData(locationSlug: LocationSlug): Promise<Location> {
    const location = await db.query.locations.findFirst({
        where: (locations, { eq }) => eq(locations.slug, locationSlug),
    });

    if (!location) {
        throw new AppError({
            internalMessage: `Location not found for slug ${locationSlug}.`,
        });
    }

    return location;
}
