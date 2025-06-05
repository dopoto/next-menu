import { auth } from '@clerk/nextjs/server';
import 'server-only';
import { ClerkSessionClaimsV2 } from '~/domain/clerk';
import { getValidClerkOrgIdOrThrow } from '~/lib/clerk-utils';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { locations, organizations } from '~/server/db/schema';

export async function getMenusPlanUsage() {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validClerkOrgId = getValidClerkOrgIdOrThrow(orgId);

    const result = await db.query.menus.findMany({
        where: (menus, { eq, and, exists }) =>
            exists(
                db
                    .select()
                    .from(locations)
                    .innerJoin(organizations, eq(locations.orgId, organizations.id))
                    .where(and(eq(locations.id, menus.locationId), eq(organizations.clerkOrgId, validClerkOrgId))),
            ),
    });

    return result.length;
}

export async function getMenuItemsPlanUsage() {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validClerkOrgId = getValidClerkOrgIdOrThrow(orgId);

    const result = await db.query.menuItems.findMany({
        where: (menuItems, { eq, and, exists }) =>
            exists(
                db
                    .select()
                    .from(locations)
                    .innerJoin(organizations, eq(locations.orgId, organizations.id))
                    .where(and(eq(locations.id, menuItems.locationId), eq(organizations.clerkOrgId, validClerkOrgId))),
            ),
    });

    return result.length;
}

export async function getLocationsPlanUsage() {
    //TODO
    return Promise.resolve(1);
}
