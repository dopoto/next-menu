"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeviceMockup } from "~/app/_components/DeviceMockup";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { ROUTES } from "~/app/_domain/routes";
import { addMenuItem } from "~/app/actions/addMenuItem";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { AddEditMenuItemForm } from "~/app/u/[locationId]/menu-items/_components/AddEditMenuItemForm";
import { PublicMenuItem } from "~/components/public/PublicMenuItem";
import { toast } from "~/hooks/use-toast";
import { handleFormErrors } from "~/lib/form-state";

export function AddMenuItem(props: { locationId: LocationId }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isNew: false,
      locationId: props.locationId,
    },
  });

  async function onSubmit(values: z.infer<typeof menuItemFormSchema>) {
    const res = await addMenuItem(values);
    if (res.status === "success") {
      toast({ title: `Menu item added` });
      router.push(ROUTES.menuItems(props.locationId));
    } else {
      handleFormErrors(form, res);
    }
  }

  return (
    <div className="flex flex-row gap-6">
      <AddEditMenuItemForm form={form} onSubmit={onSubmit} />
      <DeviceMockup>
        <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-100 dark:bg-gray-800">
          <PublicMenuItem
            item={{
              name: form.watch("name"),
              description: form.watch("description"),
              price: form.watch("price").toString(),
              isNew: form.watch("isNew"),
            }}
          />
        </div>
      </DeviceMockup>
    </div>
  );
}
