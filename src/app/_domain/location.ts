import { z } from "zod";

// export const LocationIdSchema = z.string().startsWith('org_')
// export type LocationId = z.infer<typeof LocationIdSchema>;

export const LocationIdSchema = z.number();
export type LocationId = z.infer<typeof LocationIdSchema>;