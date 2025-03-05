import { z } from "zod";

// export const LocationIdSchema = z.string().startsWith('org_')
// export type LocationId = z.infer<typeof LocationIdSchema>;

export const locationIdSchema = z.coerce.number().positive().int();
export type LocationId = z.infer<typeof locationIdSchema>;