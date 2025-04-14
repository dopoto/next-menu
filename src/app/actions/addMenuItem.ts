"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { createMenuItem } from "~/server/queries/menu-items";

export type FormState = {
  status: "success" | "error" | "loading";
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function addMenuItem(
  data: FormData, //z.infer<typeof menuItemFormSchema>,
): Promise<FormState> {
  console.log("DBG ADD MENU ITEM", data);

  const parsed = menuItemFormSchema.safeParse(data);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(data)) {
      fields[key] = "f"; //data[key]?.toString() ?? "";
    }
    return {
      status: "error",
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  await createMenuItem(parsed.data);

  // TODO: typed path:
  revalidatePath(`/u/${parsed.data.locationId}/menu-items`);
  return { status: "success", message: "Created" };
}
