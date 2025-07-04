'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { editMenuItemAction } from '~/app/actions/editMenuItemAction';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import { AddEditMenuItemForm } from '~/app/u/[locationId]/menu-items/_components/AddEditMenuItemForm';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { type MenuItem, menuItemFormSchema } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';
import { handleReactHookFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';

export function EditMenuItem(props: { locationId: LocationId; menuItem: MenuItem; currencyId: CurrencyId }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof menuItemFormSchema>>({
        resolver: zodResolver(menuItemFormSchema),
        defaultValues: {
            name: props.menuItem.name ?? '',
            description: props.menuItem.description ?? '',
            price: parseFloat(props.menuItem.price) || 0,
            isNew: props.menuItem.isNew,
            imageId: props.menuItem.imageId ?? '',
            locationId: props.locationId,
        },
    });

    async function onSubmit(values: z.infer<typeof menuItemFormSchema>) {
        const res = await editMenuItemAction(props.menuItem.id, values);
        if (res.status === 'success') {
            toast({ title: `Menu item updated` });
            router.push(ROUTES.menuItems(props.locationId));
        } else {
            handleReactHookFormErrors(form, res);
        }
    }

    return (
        <>
            <FormTitle
                title="Edit menu item"
                subtitle="Update a dish or a beverage from your menu items catalog. Each menu item can be used in one or more menus."
            />
            <AddEditMenuItemForm
                form={form}
                onSubmit={onSubmit}
                locationId={props.locationId}
                currencyId={props.currencyId}
            />
        </>
    );
}
