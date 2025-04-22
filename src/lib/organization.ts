import { z } from 'zod';

export const organizationIdSchema = z.coerce.number().positive().int();
export type OrganizationId = z.infer<typeof organizationIdSchema>;
