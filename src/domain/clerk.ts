import { z } from 'zod';

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
