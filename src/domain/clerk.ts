import { z } from 'zod';
import { AppError } from '~/lib/error-utils.server';

export type ClerkOrganizationId = `org_${string}`;
export const clerkOrgIdPrefix = (() => {
    const testValue: ClerkOrganizationId = 'org_';
    return testValue.split('_', 1)[0] + '_';
})();

export const clerkOrgIdSchema = z
    .string()
    .regex(new RegExp(`^${clerkOrgIdPrefix}.+`), {
        message: `String must start with "${clerkOrgIdPrefix}"`,
    })
    .transform((val) => val as ClerkOrganizationId);

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
