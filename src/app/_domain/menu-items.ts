import { InferSelectModel, InferInsertModel, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { menuItems } from "~/server/db/schema";
import { AppError } from "~/lib/error-utils.server";

export const menuItemIdSchema = z.number().int().positive();
export type MenuItemId = number;

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
  locationId: z
    .number({
      required_error: "Location ID is required",
    })
    .int()
    .positive(),
});

async function validateUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }
  return userId;
}

function validateAndFormatMenuItemData(
  data: z.infer<typeof menuItemFormSchema>,
) {
  const validationResult = menuItemFormSchema.safeParse(data);
  if (!validationResult.success) {
    throw new AppError({
      internalMessage: `Invalid menu item data: ${JSON.stringify(
        validationResult.error.errors,
      )}`,
    });
  }

  // Format the data for database insertion
  return {
    ...validationResult.data,
    price: validationResult.data.price.toString(), // Convert price to string for database
  };
}

export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  await validateUser();
  const dbData = validateAndFormatMenuItemData(data);

  // Insert the menu item
  await db.insert(menuItems).values(dbData);
}

export async function updateMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  await validateUser();
  const dbData = validateAndFormatMenuItemData(data);

  // Update the menu item
  const result = await db
    .update(menuItems)
    .set(dbData)
    .where(eq(menuItems.id, menuItemId));

  if (result.rowCount === 0) {
    throw new AppError({
      internalMessage: `Menu item with ID ${menuItemId} not found or not authorized for update`,
    });
  }
}
