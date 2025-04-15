"use client";

import { useRef } from "react";
import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
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
import { addMenuItem, FormState } from "~/app/actions/addMenuItem";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { DeviceMockup } from "~/app/_components/DeviceMockup";
import { MenuItem, menuItemFormSchema } from "~/app/_domain/menu-items";
import { PublicMenuItem } from "~/components/public/PublicMenuItem";
import { editMenuItem } from "~/app/actions/editMenuItem";
import { XIcon } from "lucide-react";

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
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(
    async (prevState: FormState, formData: FormData) => {
      try {
        if (mode === "add") {
          return await addMenuItem(formData);
        } else {
          await editMenuItem(menuItem?.id!, {
            ...formData,
            locationId: Number(locationId),
          });
          return { message: "success" };
        }
      } catch (error) {
        return {
          message: "An error occurred while saving the menu item",
          issues: [(error as Error).message],
        };
      }
    },
    { message: "" },
  );

  const initialValues = menuItem
    ? {
        name: menuItem.name ?? "",
        description: menuItem.description ?? "",
        price: parseFloat(menuItem.price) || 0,
        isNew: menuItem.isNew,
      }
    : {
        name: "",
        description: "",
        price: 0,
        isNew: false,
      };

  const form = useForm<FormData>({
    defaultValues: initialValues,
    resolver: zodResolver(menuItemFormSchema),
  });

  React.useEffect(() => {
    if (state?.message === "success") {
      toast({
        title: `Menu item ${mode === "add" ? "added" : "updated"} successfully`,
      });
      router.push(ROUTES.menuItems(locationId));
    } else if (state?.message && !state.issues) {
      toast({
        title: `Failed to ${mode === "add" ? "add" : "update"} menu item`,
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state?.message, mode, router, locationId]);

  return (
    <div className="flex flex-row gap-6">
      <Form {...form}>
        <form
          ref={formRef}
          action={async () => {
            const valid = await form.trigger();
            if (!valid) return;

            const data = form.getValues();
            formAction({ ...data, locationId: Number(locationId) });
          }}
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
              {mode === "edit" ? "Update" : "Add!"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.menuItems(locationId))}
            >
              Cancel
            </Button>
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
