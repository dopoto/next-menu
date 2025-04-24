import { type LocationId, locationIdSchema } from '~/domain/location';
import { AppError } from '~/lib/error-utils.server';

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
