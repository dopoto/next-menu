import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { AppError } from '~/lib/error-utils.server';
import { withMeta } from '~/lib/form-validation';
import { type menuItems } from '~/server/db/schema';

export const menuItemIdSchema = z.coerce.number().int().positive();
export type MenuItemId = number;

export type MenuItem = InferSelectModel<typeof menuItems>;
export type NewMenuItem = InferInsertModel<typeof menuItems>;

export const menuItemFormSchema = z.object({
    name: withMeta(
        z
            .string({
                required_error: 'Name is required',
            })
            .min(2, 'Name must be at least 2 characters')
            .max(256, 'Name must be at most 256 characters'),
        {
            label: 'Name',
            placeholder: 'Enter the item name',
            description: 'The name of your menu item, as it will appear to customers',
        },
    ),
    description: withMeta(z.string().max(256, 'Description must be at most 256 characters').optional(), {
        label: 'Description',
        placeholder: 'Enter a description (optional)',
        description: 'A brief description of the menu item',
    }),
    price: z
        .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
        .min(0, 'Price must be positive'),
    isNew: z.boolean(),
    locationId: z
        .number({
            required_error: 'Location ID is required',
        })
        .min(0, 'Location Id must be positive'),
});

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
