"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { menuItemFormSchema } from "~/app/_domain/menu-items";
import { addMenuItem, FormState } from "~/app/actions/addMenuItem";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

export function AddMenuItem({ locationId }: { locationId: LocationId }) {
  // const [formState, formAction] = useActionState(
  //   async (prevState: FormState | null, data: FormData) => {
  //     if (!prevState) {
  //       return null; // Handle the case where prevState is null
  //     }
  //     return await addMenuItem(prevState, data);
  //   },
  //   null,
  // );

  //console.log(formState);

  const form = useForm<z.infer<typeof menuItemFormSchema>>({
    //resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isNew: false,
      locationId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof menuItemFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // try {
    const res = await addMenuItem(values);
    console.log("DBG CLIENT", res);
    //   if (res.status === "error") {
    //     // Handle field-specific errors
    //     Object.keys(res.fields ?? {}).forEach((field) => {
    //       const fld = field as keyof z.infer<typeof menuItemFormSchema>
    //       form.setError(fld, {
    //         message:res.issues[fld]
    //       });
    //     });
    //   } else if (res.error) {
    //     // Handle general server error
    //     form.setError("server", { message: res.error });
    //   } else {
    //     // Handle success
    //     console.log("MenuItem added successfully:", res);
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     // Handle unknown error
    //     form.setError("server", { message: error.message });
    //   } else {
    //     console.error("Unknown error:", error);
    //   }
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {state?.message !== "" && !state.issues && (
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
          )} */}

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
                <FormLabel>Mark as new</FormLabel>
                <FormDescription>
                  This will highlight the item as new on the menu
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control as never}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <input type="hidden" name={field.name} value={locationId} />[
              {locationId}]
            </FormItem>
          )}
        /> */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
