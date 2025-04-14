"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { createMenuItem } from "~/server/queries/menu-items";

export async function addMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  await createMenuItem(data);

  // Revalidate the menu items page
  revalidatePath(`/u/${data.locationId}/menu-items`);
}
