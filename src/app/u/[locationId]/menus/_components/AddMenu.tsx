'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type InferSelectModel } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { addMenuAction } from '~/app/actions/addMenuAction';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import { AddEditMenuForm } from '~/app/u/[locationId]/menus/_components/AddEditMenuForm';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { menuFormSchema } from '~/domain/menus';
import { toast } from '~/hooks/use-toast';
import { handleReactHookFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { type locations } from '~/server/db/schema';

export function AddMenu(props: {
    locationId: LocationId;
    currencyId: CurrencyId;
    addMenuAction: typeof addMenuAction;
    allMenuItems: MenuItem[];
    location: InferSelectModel<typeof locations>;
}) {
    const router = useRouter();
    const form = useForm<z.infer<typeof menuFormSchema>>({
        resolver: zodResolver(menuFormSchema),
        defaultValues: {
            name: '',
            locationId: props.locationId,
        },
    });

    async function onSubmit(values: z.infer<typeof menuFormSchema>) {
        const res = await addMenuAction(values);
        if (res.status === 'success') {
            toast({ title: `Menu  added` });
            router.push(ROUTES.menus(props.locationId));
        } else {
            handleReactHookFormErrors(form, res);
        }
    }

    return (
        <>
            <FormTitle title="Add menu" subtitle="Add a menu." />
            <AddEditMenuForm
                form={form}
                onSubmit={onSubmit}
                locationId={props.locationId}
                currencyId={props.currencyId}
                allMenuItems={props.allMenuItems}
            />
        </>
    );
}
