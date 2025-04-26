'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { editMenuAction } from '~/app/actions/editMenuAction';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import { AddEditMenuForm } from '~/app/u/[locationId]/menus/_components/AddEditMenuForm';
import { type LocationId } from '~/domain/locations';
import { MenuItem } from '~/domain/menu-items';
import { type Menu, menuFormSchema } from '~/domain/menus';
import { toast } from '~/hooks/use-toast';
import { handleReactHookFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';

export function EditMenu(props: { locationId: LocationId; menu: Menu; allMenuItems: MenuItem[] }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof menuFormSchema>>({
        resolver: zodResolver(menuFormSchema),
        defaultValues: {
            name: props.menu.name ?? '',
            locationId: props.locationId,
        },
    });

    async function onSubmit(values: z.infer<typeof menuFormSchema>) {        
        const res = await editMenuAction(props.menu.id, values);

        if (res.status === 'success') {
            toast({ title: 'Menu updated' });
            router.push(ROUTES.menus(props.locationId));
        } else {
            handleReactHookFormErrors(form, res);
        }
    }

    return (
        <>
            <FormTitle title="Edit menu" subtitle="Update your menu details and manage menu items." />
            <AddEditMenuForm
                form={form}
                onSubmit={onSubmit}
                locationId={props.locationId}
                menuId={props.menu.id}
                initialItems={props.menu.items ?? []}
                allMenuItems={props.allMenuItems}
            />
        </>
    );
}
