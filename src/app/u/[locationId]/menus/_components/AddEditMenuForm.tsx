'use client';

import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { MenuItemsManager } from '~/app/u/[locationId]/menus/_components/MenuItemsManager';
import { PreviewMenu } from '~/app/u/[locationId]/menus/_components/PreviewMenu';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { menuFormSchema } from '~/domain/menus';
import { ROUTES } from '~/lib/routes';

export function AddEditMenuForm({
    form,
    onSubmit,
    locationId,
    menuId,
    allMenuItems,
    initialItems = [],
}: {
    form: UseFormReturn<z.infer<typeof menuFormSchema>>;
    onSubmit: (values: z.infer<typeof menuFormSchema>) => Promise<void>;
    locationId: LocationId;
    menuId?: number;
    allMenuItems: MenuItem[];
    initialItems?: MenuItem[];
}) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);

    const handleSubmit = async (values: z.infer<typeof menuFormSchema>) => {
        // Add the items to the form data
        await onSubmit({ ...values, items });
    };

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {form.formState.errors.root && (
                        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    <ReactHookFormField schema={menuFormSchema} form={form} fieldName={'name'} />

                    <MenuItemsManager
                        locationId={locationId}
                        menuId={menuId}
                        allMenuItems={allMenuItems}
                        initialItems={initialItems}
                        onItemsChange={setItems}
                    />

                    <div className="flex flex-row gap-2">
                        <Button type="submit">Save</Button>
                        <a href={ROUTES.menus(locationId)}>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </a>
                    </div>
                </form>
            </Form>
            <PreviewMenu
                menuItem={{
                    name: form.watch('name'),
                }}
            />
        </div>
    );
}
