import { eq } from 'drizzle-orm';
import { AppError } from '~/lib/error-utils.server';
import { getValidOrganizationIdOrThrow } from '~/lib/organization';
import { db } from '~/server/db';
import { locations, organizations, users } from '~/server/db/schema';

export async function createOrganization({
    clerkUserId,
    orgId,
    stripeCustomerId,
    locationName,
    locationSlug,
}: {
    clerkUserId: string;
    orgId: string;
    stripeCustomerId?: string;
    locationName: string;
    locationSlug: string;
}) {
    const insertedLocation = await db.transaction(async (trx) => {
        const [organization] = await trx
            .insert(organizations)
            .values({
                clerkOrgId: orgId,
                stripeCustomerId: stripeCustomerId,
            })
            .returning({
                id: organizations.id,
            });

        if (!organization) {
            throw new AppError({ internalMessage: 'Failed to insert organization' });
        }

        const [user] = await trx
            .insert(users)
            .values({
                clerkUserId: clerkUserId,
                role: 'orgowner',
                orgId: organization.id,
            })
            .returning({
                id: users.id,
                role: users.role,
            });

        if (!user) {
            throw new AppError({ internalMessage: 'Failed to insert user' });
        }

        const [location] = await db
            .insert(locations)
            .values({
                name: locationName,
                slug: locationSlug,
                orgId: organization.id,
            })
            .returning();

        if (!location) {
            throw new AppError({ internalMessage: 'Failed to insert location' });
        }

        return location;
    });

    return insertedLocation;
}

export async function updateOrganizationStripeCustomerId({
    clerkOrgId,
    stripeCustomerId,
}: {
    clerkOrgId: string;
    stripeCustomerId: string | null;
}) {
    // TODO Checks

    const [updatedOrganization] = await db
        .update(organizations)
        .set({
            stripeCustomerId,
        })
        .where(eq(organizations.clerkOrgId, clerkOrgId))
        .returning({ id: organizations.id });
    return updatedOrganization;
}

export async function getOrganizationById(orgId: string) {
    const validatedOrgId = getValidOrganizationIdOrThrow(orgId);

    // TODO Checks
    const item = await db.query.organizations.findFirst({
        where: (model, { eq }) => eq(model.id, validatedOrgId),
    });
    if (!item) {
        throw new AppError({ internalMessage: `Not found: ${orgId}` });
    }

    return item;
}
