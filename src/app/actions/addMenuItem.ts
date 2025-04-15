"use server";

import { type z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema } from "~/lib/menu-items";
import { createMenuItem } from "~/server/queries/menu-items";
import { type FormState, processFormErrors } from "~/lib/form-state";
import { ROUTES } from "~/lib/routes";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";

export async function addMenuItem(
  data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
  const parsed = menuItemFormSchema.safeParse(data);
  if (!parsed.success) {
    return processFormErrors(parsed.error, data);
  }

  const availableQuota = await getAvailableFeatureQuota("menuItems");
  if (availableQuota <= 0) {
    return {
      status: "error",
      rootError: "Out of quota for menu items.",
    };
  }

  try {
    await createMenuItem(parsed.data);
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
