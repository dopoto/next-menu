import { eq } from 'drizzle-orm';
import { AppError } from '~/lib/error-utils.server';
import { getValidOrganizationIdOrThrow } from '~/lib/organization';
import { db } from '~/server/db';
import { organizations, users } from '~/server/db/schema';

export async function addOrganizationAndUser(clerkUserId: string, orgId: string, stripeCustomerId?: string) {
    // TODO Checks ? auth etc
    const insertedOrg = await db.transaction(async (trx) => {
        const [org] = await trx
            .insert(organizations)
            .values({
                clerkOrgId: orgId,
                stripeCustomerId: stripeCustomerId,
            })
            .returning({ id: organizations.id });

        await trx.insert(users).values({
            clerkUserId: clerkUserId,
            role: 'orgowner',
            orgId: org?.id ?? 0, // TODO handle instead
        });

        return org;
    });

    return insertedOrg;
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
