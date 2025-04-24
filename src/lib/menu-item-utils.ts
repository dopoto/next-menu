import { z } from 'zod';
import { menuItemFormSchema, MenuItemId, menuItemIdSchema } from '~/domain/menu-items';
import { AppError } from '~/lib/error-utils.server';

export function getValidMenuItemIdOrThrow(candidate?: string): MenuItemId {
    const validationResult = menuItemIdSchema.safeParse(candidate);
    if (!validationResult.success) {
        throw new AppError({
            internalMessage: `Menu Item Id validation failed for ${JSON.stringify(candidate)}`,
        });
    }
    return validationResult.data;
}

/**
  Formats the data for database insertion.
 */
export function validateAndFormatMenuItemData(data: z.infer<typeof menuItemFormSchema>) {
    const validationResult = menuItemFormSchema.safeParse(data);
    if (!validationResult.success) {
        throw new AppError({
            internalMessage: `Invalid menu item data: ${JSON.stringify(validationResult.error)}`,
        });
    }

    return {
        ...validationResult.data,
        price: validationResult.data.price.toString(),
    };
}
