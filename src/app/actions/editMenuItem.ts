"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { menuItems } from "~/server/db/schema";
import { AppError } from "~/lib/error-utils.server";
import { menuItemFormSchema, MenuItemId } from "~/app/_domain/menu-items";

export async function editMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  // Validate the input data
  const validationResult = menuItemFormSchema.safeParse(data);
  if (!validationResult.success) {
    throw new AppError({
      internalMessage: `Invalid menu item data: ${JSON.stringify(
        validationResult.error.errors,
      )}`,
    });
  }

  // Format the data for database insertion
  const dbData = {
    ...validationResult.data,
    price: validationResult.data.price.toString(), // Convert price to string for database
  };

  // Update the menu item
  const result = await db
    .update(menuItems)
    .set(dbData)
    .where(menuItems.id.eq(menuItemId).and(menuItems.orgId.eq(orgId)));

  if (result.rowCount === 0) {
    throw new AppError({
      internalMessage: `Menu item with ID ${menuItemId} not found or not authorized for update`,
    });
  }

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}
