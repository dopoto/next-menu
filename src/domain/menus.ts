import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { withMeta } from "~/lib/form-validation";
import { menus } from "~/server/db/schema";

export type Menu = InferSelectModel<typeof menus>;
export type NewMenu = InferInsertModel<typeof menus>;

export const menuIdSchema = z.coerce.number().int().positive();
export type MenuId = z.infer<typeof menuIdSchema>;

export const menuFormSchema = z.object({
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
});