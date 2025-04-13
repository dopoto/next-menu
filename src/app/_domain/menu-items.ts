import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { menuItems } from "~/server/db/schema";

export const menuItemIdSchema = z.coerce.number().positive().int();
export type MenuItemId = z.infer<typeof menuItemIdSchema>;

export type MenuItem = InferSelectModel<typeof menuItems>;
export type NewMenuItem = InferInsertModel<typeof menuItems>;

export const menuItemFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(256, "Name must be at most 256 characters"),
  description: z
    .string()
    .max(256, "Description must be at most 256 characters")
    .optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price must be positive"),
  isNew: z.boolean().default(false),
  locationId: z.number({
    required_error: "Location ID is required",
  }),
});
