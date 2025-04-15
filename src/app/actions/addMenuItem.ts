"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { createMenuItem } from "~/server/queries/menu-items";

export type FieldErrors = Record<string, string[] | undefined>;

export type FormState = {
  status: "success" | "error";
  message: string;
  fields?: Record<string, string>;
  errors?: FieldErrors;
};

export async function addMenuItem(
  data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState> {
  console.log("DBG ADD MENU ITEM", data);

  const parsed = menuItemFormSchema.safeParse(data);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    const errors: FieldErrors = {};

    // Group validation errors by field
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString(); // Get the field name from the path
      if (field) {
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field]!.push(issue.message);
      }
    });

    // Collect submitted field values
    for (const key of Object.keys(data ?? {})) {
      fields[key] = data[key as keyof typeof data]?.toString() ?? "";
    }

    return {
      status: "error",
      message: "Invalid form data",
      fields,
      errors,
    };
  }

  await createMenuItem(parsed.data);

  // TODO: typed path:
  revalidatePath(`/u/${parsed.data.locationId}/menu-items`);
  return { status: "success", message: "Created" };
}
