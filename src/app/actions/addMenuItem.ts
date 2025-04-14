"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema, createMenuItem } from "~/app/_domain/menu-items";

export async function addMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  await createMenuItem(data);

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}
