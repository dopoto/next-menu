"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { menuItems } from "~/server/db/schema";
import { AppError } from "~/lib/error-utils.server";

const addMenuItemSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }).min(2, "Name must be at least 2 characters").max(256, "Name must be at most 256 characters"),
  description: z.string().max(256, "Description must be at most 256 characters").optional(),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).min(0, "Price must be positive"),
  isNew: z.boolean().default(false),
  locationId: z.number({
    required_error: "Location ID is required",
  }),
});

export async function addMenuItem(data: z.infer<typeof addMenuItemSchema>) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  // Validate the input data
  const validationResult = addMenuItemSchema.safeParse(data);
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

  // Insert the menu item
  await db.insert(menuItems).values(dbData);

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}