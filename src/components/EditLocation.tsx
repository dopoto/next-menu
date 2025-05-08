'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { AddEditLocationForm } from '~/components/AddEditLocationForm';
import { locationFormSchema } from '~/domain/locations';
import { type LocationId, locationIdSchema, type Location, type LocationSlug } from '~/domain/locations';

export function EditLocation(props: { location: Location }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof locationFormSchema>>({
        resolver: zodResolver(locationFormSchema),
        defaultValues: {
            currencyId: props.location.currencyId,
            locationName: props.location.name
        },
    });

    async function onSubmit(values: z.infer<typeof locationFormSchema>) {
        // TODO
        // const res = await editMenuAction(props.menu.id, values);
        // if (res.status === 'success') {
        //     toast({ title: 'Menu updated' });
        //     router.push(ROUTES.menus(props.locationId));
        // } else {
        //     handleReactHookFormErrors(form, res);
        // }
    }

    return <AddEditLocationForm form={form} onSubmit={onSubmit} />;
    
}
