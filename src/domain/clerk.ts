import { z } from 'zod';

/**
 * @see https://clerk.com/docs/backend-requests/resources/session-tokens > Version 2.
 */
export type ClerkSessionClaimsV2 = {
    o: {
        id: string;
    }
}

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
