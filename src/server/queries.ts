import { auth } from '@clerk/nextjs/server';
import { and } from 'drizzle-orm';
import 'server-only';
import { AppError } from '~/lib/error-utils.server';
import { type LocationId } from '~/lib/location';
import { getValidOrganizationIdOrThrow } from '~/lib/organization';
import { db } from '~/server/db';
import { locations } from './db/schema';

export async function getMenusPlanUsage() {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validatedOrgId = getValidOrganizationIdOrThrow(sessionClaims?.org_id);

    const result = await db.query.menus.findMany({
        where: (menus, { eq, and, exists }) =>
            exists(
                db
                    .select()
                    .from(locations)
                    .where(and(eq(locations.id, menus.locationId), eq(locations.orgId, validatedOrgId))),
            ),
    });

    return result.length;
}

export async function getMenuItemsPlanUsage() {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const orgId = sessionClaims?.org_id;
    if (!orgId) {
        throw new AppError({ internalMessage: 'No organization ID found' });
    }

    const result = await db.query.menuItems.findMany({
        where: (menuItems, { eq, and, exists }) =>
            exists(
                db
                    .select()
                    .from(locations)
                    .where(and(eq(locations.id, menuItems.locationId), eq(locations.orgId, Number(orgId)))),
            ),
    });

    return result.length;
}

export async function getLocationsPlanUsage() {
    //TODO
    return Promise.resolve(1);
}

export async function getLocation(id: LocationId) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const orgId = sessionClaims?.org_id;
    if (!orgId) {
        throw new AppError({ internalMessage: 'No organization ID found' });
    }

    const item = await db.query.locations.findFirst({
        where: (model, { eq }) => and(eq(model.id, Number(id)), eq(model.orgId, Number(orgId))),
    });

    if (!item) {
        throw new AppError({ internalMessage: `Not found: ${id}` });
    }

    return item;
}
