"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  menuItemFormSchema,
  MenuItemId,
  updateMenuItem,
} from "~/app/_domain/menu-items";

export async function editMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  await updateMenuItem(menuItemId, data);

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}
