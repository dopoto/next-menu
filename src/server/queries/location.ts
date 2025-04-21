import { auth } from '@clerk/nextjs/server';
import { exists } from 'drizzle-orm';
import 'server-only';
import { AppError } from '~/lib/error-utils.server';
import { type LocationId, type LocationSlug } from '~/lib/location';
import { getValidOrganizationIdOrThrow } from '~/lib/organization';
import { db } from '~/server/db';
import { locations, users, type Location, type Menu } from '~/server/db/schema';

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

export async function addLocation(orgId: string, name: string, slug: string) {
    const validatedOrgId = getValidOrganizationIdOrThrow(orgId);
    const [insertedLocation] = await db
        .insert(locations)
        .values({
            name: name,
            slug: slug,
            orgId: validatedOrgId,
        })
        .returning({ id: locations.id });
    return insertedLocation;
}

/**
 * Checks if the location exists in the database and if it belongs to
 * the organization the user is in.
 * Throws an error if that's not the case.
 * @param locationId
 * @param orgId
 * @param userId
 * @returns The valid Location Id.
 */
export async function getLocation(locationId: LocationId, orgId: string, userId: string): Promise<LocationId> {
    const validatedOrgId = getValidOrganizationIdOrThrow(orgId);

    const location = await db.query.locations.findFirst({
        where: (locations, { and, eq }) =>
            and(
                eq(locations.id, locationId),
                eq(locations.orgId, validatedOrgId),
                exists(
                    db
                        .select()
                        .from(users)
                        .where((user) => and(eq(user.clerkUserId, userId), eq(user.orgId, validatedOrgId))),
                ),
            ),
    });

    if (!location) {
        throw new AppError({
            internalMessage: `Location not found or access denied. Location ID: ${locationId}, Org ID: ${orgId}, User ID: ${userId}`,
        });
    }

    return location.id;
}

export async function getMenusByLocation(locationId: LocationId): Promise<Menu[]> {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const orgId = sessionClaims?.org_id;
    const validatedOrgId = getValidOrganizationIdOrThrow(orgId);
    if (!validatedOrgId) {
        throw new AppError({ internalMessage: `No valid organization ID found for claim ${orgId}` });
    }

    // First verify the location belongs to the organization
    const location = await db.query.locations.findFirst({
        where: (locations, { and, eq }) => and(eq(locations.id, locationId), eq(locations.orgId, validatedOrgId)),
    });

    if (!location) {
        throw new AppError({
            internalMessage: 'Location not found or access denied',
        });
    }

    // Now fetch menus for this location
    const items = await db.query.menus.findMany({
        where: (menus, { eq }) => eq(menus.locationId, locationId),
        orderBy: (menus, { desc }) => desc(menus.name),
    });

    return items;
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
