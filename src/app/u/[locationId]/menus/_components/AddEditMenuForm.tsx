'use client';

import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { MenuItemsManager } from '~/app/u/[locationId]/menus/_components/MenuItemsManager';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { menuFormSchema } from '~/domain/menus';
import { ROUTES } from '~/lib/routes';

export function AddEditMenuForm({
    form,
    onSubmit,
    locationId,
    currencyId,
    allMenuItems,
    initialItems = [],
}: {
    form: UseFormReturn<z.infer<typeof menuFormSchema>>;
    onSubmit: (values: z.infer<typeof menuFormSchema>) => Promise<void>;
    locationId: LocationId;
    currencyId: CurrencyId;
    allMenuItems: MenuItem[];
    initialItems?: MenuItem[];
}) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof menuFormSchema>) => {
        setIsSubmitting(true);
        try {
            await onSubmit({ ...values, items });
        } finally {
            setIsSubmitting(false);
        }
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
                        allMenuItems={allMenuItems}
                        initialItems={initialItems}
                        onItemsChange={setItems}
                        currencyId={currencyId}
                    />

                    <div className="flex flex-row gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <a href={ROUTES.menus(locationId)}>
                            <Button variant="secondary" type="button" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </a>
                    </div>
                </form>
            </Form>
        </div>
    );
}
