import { type z } from 'zod';
import { menuWithItemsFormSchema, type MenuId, menuIdSchema } from '~/domain/menus';
import { AppError } from '~/lib/error-utils.server';

export function getValidMenuIdOrThrow(candidate?: string): MenuId {
    const validationResult = menuIdSchema.safeParse(candidate);
    if (!validationResult.success) {
        throw new AppError({
            internalMessage: `Menu Id validation failed for ${JSON.stringify(candidate)}`,
        });
    }
    return validationResult.data;
}

/**
  Formats the data for database insertion.
 */
export function validateAndFormatMenuData(data: z.infer<typeof menuWithItemsFormSchema>) {
    const validationResult = menuWithItemsFormSchema.safeParse(data);
    if (!validationResult.success) {
        throw new AppError({
            internalMessage: `Invalid menu data: ${JSON.stringify(validationResult.error)}`,
        });
    }

    return {
        name: validationResult.data.name,
        locationId: validationResult.data.locationId,
        items: validationResult.data.items,
    };
}
