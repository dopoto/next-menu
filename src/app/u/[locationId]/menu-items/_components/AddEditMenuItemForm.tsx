import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { PreviewMenuItem } from '~/app/u/[locationId]/menu-items/_components/PreviewMenuItem';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { type LocationId } from '~/domain/location';
import { menuItemFormSchema } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';

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
        <div className="flex flex-col gap-6 lg:flex-row">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {form.formState.errors.root && (
                        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    <ReactHookFormField schema={menuItemFormSchema} form={form} fieldName={'name'} />
                    <ReactHookFormField schema={menuItemFormSchema} form={form} fieldName={'description'} />

                    <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>NEW badge</FormLabel>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                <FormDescription>Highlight the item as new on the menu</FormDescription>
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
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormDescription>The price of the menu item</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row gap-2">
                        <Button type="submit">Save</Button>
                        <a href={ROUTES.menuItems(locationId)}>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </a>
                    </div>
                </form>
            </Form>
            <PreviewMenuItem
                menuItem={{
                    name: form.watch('name'),
                    description: form.watch('description'),
                    price: form.watch('price').toString(),
                    isNew: form.watch('isNew'),
                }}
            />
        </div>
    );
}
