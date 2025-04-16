"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { DeviceMockup } from "~/app/_components/DeviceMockup";
import { addMenuItem } from "~/app/actions/addMenuItem";
import { AddEditMenuItemForm } from "~/app/u/[locationId]/menu-items/_components/AddEditMenuItemForm";
import { PublicMenuItem } from "~/components/public/PublicMenuItem";
import { toast } from "~/hooks/use-toast";
import { handleFormErrors } from "~/lib/form-state";
import { type LocationId } from "~/lib/location";
import { menuItemFormSchema } from "~/lib/menu-items";
import { ROUTES } from "~/lib/routes";

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
    <AddEditMenuItemForm
      form={form}
      onSubmit={onSubmit}
      locationId={props.locationId}
    />
  );
}
