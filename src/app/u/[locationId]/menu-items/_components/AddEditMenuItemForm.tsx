import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import type { LocationId } from "~/app/u/[locationId]/_domain/locations";
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
import { type menuItemFormSchema } from "~/lib/menu-items";
import { ROUTES } from "~/lib/routes";

export function AddEditMenuItemForm({
  form,
  onSubmit,
  locationId,
}: {
  form: UseFormReturn<z.infer<typeof menuItemFormSchema>>;
  onSubmit: (values: z.infer<typeof menuItemFormSchema>) => Promise<void>;
  locationId: LocationId;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {form.formState.errors.root && (
          <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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

        <div className="flex flex-row gap-2">
          <Button type="submit">Save</Button>
          <a href={ROUTES.menuItems(locationId)}>
            <Button variant="secondary">Cancel</Button>
          </a>
        </div>
      </form>
    </Form>
  );
}
