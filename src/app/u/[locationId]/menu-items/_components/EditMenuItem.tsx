'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { DeviceMockup } from '~/app/_components/DeviceMockup';
import { editMenuItem } from '~/app/actions/editMenuItem';
import { type LocationId } from '~/app/u/[locationId]/_domain/locations';
import { AddEditMenuItemForm } from '~/app/u/[locationId]/menu-items/_components/AddEditMenuItemForm';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { toast } from '~/hooks/use-toast';
import { handleFormErrors } from '~/lib/form-state';
import { type MenuItem, menuItemFormSchema } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';

export function EditMenuItem(props: { locationId: LocationId; menuItem: MenuItem }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof menuItemFormSchema>>({
        resolver: zodResolver(menuItemFormSchema),
        defaultValues: {
            name: props.menuItem.name ?? '',
            description: props.menuItem.description ?? '',
            price: parseFloat(props.menuItem.price) || 0,
            isNew: props.menuItem.isNew,
            locationId: props.locationId,
        },
    });

    async function onSubmit(values: z.infer<typeof menuItemFormSchema>) {
        const res = await editMenuItem(props.menuItem.id, values);
        if (res.status === 'success') {
            toast({ title: `Menu item updated` });
            router.push(ROUTES.menuItems(props.locationId));
        } else {
            handleFormErrors(form, res);
        }
    }

    return (
        <div className="flex flex-row gap-6">
            <AddEditMenuItemForm form={form} onSubmit={onSubmit} />
            <DeviceMockup>
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-100 dark:bg-gray-800">
                    <PublicMenuItem
                        item={{
                            name: form.watch('name'),
                            description: form.watch('description'),
                            price: form.watch('price').toString(),
                            isNew: form.watch('isNew'),
                        }}
                    />
                </div>
            </DeviceMockup>
        </div>
    );
}
