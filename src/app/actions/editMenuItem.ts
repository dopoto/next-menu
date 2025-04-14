"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema, MenuItemId } from "~/app/_domain/menu-items";
import { updateMenuItem } from "~/server/queries/menu-items";

export async function editMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  //TODO
  await updateMenuItem(menuItemId, 1, data);

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}
