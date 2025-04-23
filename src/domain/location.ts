import { z } from 'zod';

export const locationIdSchema = z.coerce.number().positive().int();
export type LocationId = z.infer<typeof locationIdSchema>;

export const locationSlugSchema = z.coerce.string();
export type LocationSlug = z.infer<typeof locationSlugSchema>;
