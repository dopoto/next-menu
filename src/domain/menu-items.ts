import { z } from 'zod';
import { withMeta } from '../lib/form-validation';
import { Doc, Id } from 'convex/_generated/dataModel';

type MenuItemDoc = Doc<"menuItems">

export type MenuItem = MenuItemDoc
export type NewMenuItem = Omit<MenuItem, '_id'>

export type MenuItemWithSortOrder = MenuItem & {
    sortOrderIndex: number;
};

export type MenuItemId = Id<"menuItems">;

export const menuItemFormSchema = z.object({
    _id: z.custom<Id<"menuItems">>(),
    _creationTime: z.number(),
    locationId: z
        .number({
            required_error: 'Location ID is required',
        })
        .min(0, 'Location Id must be positive'),
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
    imageId: withMeta(z.string().optional(), {
        label: 'Image',
        description: 'Upload an image for this menu item',
    }),
    price: z
        .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
        .min(0, 'Price must be positive'),
    isNew: z.boolean(),
});
