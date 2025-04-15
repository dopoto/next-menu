"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema, MenuItemId } from "~/lib/menu-items";
import { updateMenuItem } from "~/server/queries/menu-items";
import { FormState, processFormErrors } from "~/lib/form-state";
import { ROUTES } from "~/lib/routes";

export async function editMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
  const parsed = menuItemFormSchema.safeParse(data);
  if (!parsed.success) {
    return processFormErrors(parsed.error, data);
  }

  try {
    await updateMenuItem(menuItemId, parsed.data);
    revalidatePath(ROUTES.menuItems(parsed.data.locationId));
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      rootError:
        error instanceof Error ? error.message : "Could not save data.",
    };
  }
}
