import { AppError } from '~/lib/error-utils.server';

import { z } from 'zod';

export const locationIdSchema = z.coerce.number().positive().int();
export type LocationId = z.infer<typeof locationIdSchema>;

export const locationSlugSchema = z.coerce.string();
export type LocationSlug = z.infer<typeof locationSlugSchema>;

export function getValidLocationIdOrThrow(candidate?: string): LocationId {
    const locationValidationResult = locationIdSchema.safeParse(candidate);
    if (!locationValidationResult.success) {
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(candidate)}`,
        });
    }
    const parsedlocationId = locationValidationResult.data;
    return parsedlocationId;
}
