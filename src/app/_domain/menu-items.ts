import { InferSelectModel, InferInsertModel, eq } from "drizzle-orm";
import { z } from "zod";
import { menuItems } from "~/server/db/schema";
import { AppError } from "~/lib/error-utils.server";

export const menuItemIdSchema = z.number().int().positive();
export type MenuItemId = number;

export type MenuItem = InferSelectModel<typeof menuItems>;
export type NewMenuItem = InferInsertModel<typeof menuItems>;

export const menuItemFormSchema = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(256, "Name must be at most 256 characters"),
  description: z
    .string()
    .max(256, "Description must be at most 256 characters")
    .optional(),
  price: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Price is required"
          : "Price must be a number",
    })
    .min(0, { error: "Price must be positive" }),
  isNew: z.boolean().default(false),
  locationId: z
    .number({
      error: "Location ID is required",
    })
    .int()
    .positive(),
});

export function validateAndFormatMenuItemData(
  data: z.infer<typeof menuItemFormSchema>,
) {
  const validationResult = menuItemFormSchema.safeParse(data);
  if (!validationResult.success) {
    throw new AppError({
      internalMessage: `Invalid menu item data: ${JSON.stringify(
        validationResult.error,
      )}`,
    });
  }

  // Format the data for database insertion
  return {
    ...validationResult.data,
    price: validationResult.data.price.toString(), // Convert price to string for database
  };
}
