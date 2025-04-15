"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { createMenuItem } from "~/server/queries/menu-items";
import { FormState, processFormErrors } from "~/lib/form-state";

export async function addMenuItem(
  data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
  const parsed = menuItemFormSchema.safeParse(data);
  if (!parsed.success) {
    return processFormErrors(parsed.error, data);
  }

  try {
    await createMenuItem(parsed.data);
    revalidatePath(`/u/${parsed.data.locationId}/menu-items`);
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      rootError:
        error instanceof Error ? error.message : "Could not save data.",
    };
  }
}
