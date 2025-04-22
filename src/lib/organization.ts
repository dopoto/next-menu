import { z } from 'zod';

export const organizationIdSchema = z.coerce.number().positive().int();
export type OrganizationId = z.infer<typeof organizationIdSchema>;

// export function getValidOrganizationIdOrThrow(candidate?: string): OrganizationId {
//     const organizationValidationResult = organizationIdSchema.safeParse(candidate);
//     if (!organizationValidationResult.success) {
//         throw new AppError({
//             internalMessage: `Organization validation failed. params: ${JSON.stringify(candidate)}`,
//         });
//     }
//     const parsedOrganizationId = organizationValidationResult.data;
//     return parsedOrganizationId;
// }
