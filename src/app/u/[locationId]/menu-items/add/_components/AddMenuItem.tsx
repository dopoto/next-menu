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
import { addMenuItem } from "../actions";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import type { FieldValues } from "react-hook-form";

const formSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }).min(2, "Name must be at least 2 characters").max(256, "Name must be at most 256 characters"),
  description: z.string().default(""),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).min(0, "Price must be positive"),
  isNew: z.boolean().default(false),
});

type FormData = {
  name: string;
  description: string;
  price: number;
  isNew: boolean;
};

export function AddMenuItem({ locationId }: { locationId: LocationId }) {
  const router = useRouter();
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isNew: false,
    },
    resolver: zodResolver(formSchema) as never,
  });

  const onSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      await addMenuItem({
        ...data,
        locationId: Number(locationId),
      });

      toast({
        title: "Menu item added successfully",
      });

      router.push(ROUTES.menuItems(locationId));
    } catch (error) {
      toast({
        title: "Failed to add menu item",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={form.control as never}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter the item name" 
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The name of your menu item as it will appear on the menu
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  The price of the menu item
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as never}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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

          <div className="flex gap-4">
            <Button type="submit">Add Menu Item</Button>
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
    </div>
  );
}