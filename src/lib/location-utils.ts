import { type LocationId, locationIdSchema } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';

export function getValidLocationIdOrThrow(candidate?: string | number): LocationId {
    const parsedLocationId = getValidLocationId(candidate);
    if (parsedLocationId == null) {
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(candidate)}`,
        });
    }
    return parsedLocationId;
}

export function getValidLocationId(candidate?: string | number): LocationId | null {
    if (!candidate) {
        return null;
    }

    const locationValidationResult = locationIdSchema.safeParse(candidate);
    if (!locationValidationResult.success) {
        return null;
    }

    const parsedlocationId = locationValidationResult.data;
    return parsedlocationId;
}
