import { type ClerkOrganizationId, clerkOrgIdSchema } from '~/domain/clerk';
import { AppError } from '~/lib/error-utils.server';

export function getValidClerkOrgIdOrThrow(candidate?: string): ClerkOrganizationId {
    const clerkOrgIdValidationResult = clerkOrgIdSchema.safeParse(candidate);
    if (!clerkOrgIdValidationResult.success) {
        throw new AppError({
            internalMessage: `ClerkOrgId validation failed. params: ${candidate}`,
        });
    }
    const parsedClerkOrgId = clerkOrgIdValidationResult.data;
    return parsedClerkOrgId;
}
