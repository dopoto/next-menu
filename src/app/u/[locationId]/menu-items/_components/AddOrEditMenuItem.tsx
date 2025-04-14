"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "~/app/_domain/routes";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "~/hooks/use-toast";
import { addMenuItem } from "~/app/actions/addMenuItem";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { DeviceMockup } from "~/app/_components/DeviceMockup";
import { MenuItem, menuItemFormSchema } from "~/app/_domain/menu-items";
import { PublicMenuItem } from "~/components/public/PublicMenuItem";
import { editMenuItem } from "~/app/actions/editMenuItem";
import { useFormState } from "react-dom";
import { XIcon } from "lucide-react";
import { useRef } from "react";

type FormData = z.infer<typeof menuItemFormSchema>;

export function AddOrEditMenuItem({
  locationId,
  menuItem,
}: {
  locationId: LocationId;
  menuItem?: MenuItem;
}) {
  const mode = menuItem ? "edit" : "add";

  const router = useRouter();

  const [state, formAction] = useFormState(addMenuItem, {
    status: "loading",
    message: "",
  });

  const initialValues = menuItem
    ? {
        name: menuItem.name ?? "",
        description: menuItem.description ?? "",
        price: (parseFloat(menuItem.price) || 0).toString(),
        isNew: menuItem.isNew ?? (false as boolean),
      }
    : {
        name: "",
        description: "",
        price: "0",
        isNew: false,
      };

  const form = useForm<FormData>({
    defaultValues: initialValues,
    resolver: zodResolver(menuItemFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("DBG ON SUB");
    mode === "add" ? await add(data) : await edit(data);
  };

  const add = async (data: FormData) => {
    console.log("DBG ON ADD");
    try {
      await addMenuItem(data);

      toast({
        title: "Menu item added successfully",
      });

      router.push(ROUTES.menuItems(locationId));
    } catch (error) {
      toast({
        title: "Failed to add menu item",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const edit = async (data: FormData) => {
    try {
      const menuItemId = menuItem?.id;
      if (!menuItemId) {
        throw new Error("Menu item ID is required for editing.");
      }

      await editMenuItem(menuItemId, {
        ...data,
        locationId: Number(locationId),
      });

      toast({
        title: "Menu item updated successfully",
      });

      router.push(ROUTES.menuItems(locationId));
    } catch (error) {
      toast({
        title: "Failed to update menu item",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-row gap-6">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {state?.message !== "" && !state.issues && (
            <div className="text-red-500">{state.message}</div>
          )}
          {state?.issues && (
            <div className="text-red-500">
              <ul>
                {state.issues.map((issue) => (
                  <li key={issue} className="flex gap-1">
                    <XIcon fill="red" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <FormField
            control={form.control as never}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the item name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your menu item, as it will appear on the menu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as never}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a description (optional)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the menu item
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as never}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>The price of the menu item</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as never}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mark as New</FormLabel>
                  <FormDescription>
                    This will highlight the item as new on the menu
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control as never}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <input type="hidden" name={field.name} value={locationId} />[
                {locationId}]
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" variant="default">
              {mode === "edit" ? "Update" : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.menuItems(locationId))}
            >
              Cancel
            </Button>
          </div>

          <div className="flex gap-2">
            {form.formState.errors.root?.serverError && (
              <p className="text-sm text-red-600">
                {form.formState.errors.root.serverError.message}
              </p>
            )}
          </div>
        </form>
      </Form>
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
