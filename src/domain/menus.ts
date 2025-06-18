import { z } from 'zod';
import { withMeta } from '~/lib/form-validation';
import { type MenuItem, type MenuItemWithSortOrder } from './menu-items';
import { Doc, Id } from 'convex/_generated/dataModel';

type MenuDoc = Doc<"menus">;

export type Menu = MenuDoc

export type MenuWithItems = Menu & {
    items: MenuItemWithSortOrder[];
};

export type NewMenu = Omit<Menu, '_id'>;

export type MenuId = Id<'menus'>;
export const menuIdSchema = z.custom<MenuId>();

export const menuFormSchema = z.object({
    _id: z.custom<Id<"menus">>(),
    _creationTime: z.number(),
    name: withMeta(
        z
            .string({
                required_error: 'Name is required',
            })
            .min(2, 'Name must be at least 2 characters')
            .max(256, 'Name must be at most 256 characters'),
        {
            label: 'Name',
            placeholder: 'Enter the menu name',
            description: 'The name of your menu, as it will appear to customers',
        },
    ),
    locationId: z
        .number({
            required_error: 'Location ID is required',
        })
        .min(0, 'Location Id must be positive'),
    items: z.array(z.custom<MenuItem>()).optional(),
});
