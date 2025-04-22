import { auth } from '@clerk/nextjs/server';
import 'server-only';
import { getValidClerkOrgIdOrThrow } from '~/app/_domain/clerk';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { locations, organizations } from './db/schema';

export async function getMenusPlanUsage() {
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

// export async function getLocation(id: LocationId) {
//     const { userId, sessionClaims } = await auth();
//     if (!userId) {
//         throw new AppError({ internalMessage: 'Unauthorized' });
//     }

//     const orgId = sessionClaims?.org_id;
//     if (!orgId) {
//         throw new AppError({ internalMessage: 'No organization ID found' });
//     }

//     const item = await db.query.locations.findFirst({
//         where: (model, { eq }) => and(eq(model.id, Number(id)), eq(model.orgId, Number(orgId))),
//     });

//     if (!item) {
//         throw new AppError({ internalMessage: `Not found: ${id}` });
//     }

//     return item;
// }
