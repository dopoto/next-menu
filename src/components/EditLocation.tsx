'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { editLocationAction } from '~/app/actions/editLocationAction';
import { AddEditLocationForm } from '~/components/AddEditLocationForm';
import { locationFormSchema, type Location } from '~/domain/locations';
import { toast } from '~/hooks/use-toast';
import { handleReactHookFormErrors } from '~/lib/form-state';

export function EditLocation(props: { location: Location }) {
    const form = useForm<z.infer<typeof locationFormSchema>>({
        resolver: zodResolver(locationFormSchema),
        defaultValues: {
            currencyId: props.location.currencyId,
            name: props.location.name,
            menuMode: props.location.menuMode,
        },
    });

    async function onSubmit(values: z.infer<typeof locationFormSchema>) {
        const res = await editLocationAction(props.location.id, values);
        if (res.status === 'success') {
            toast({ title: 'Location updated' });
        } else {
            handleReactHookFormErrors(form, res);
        }
    }

    return <AddEditLocationForm form={form} onSubmit={onSubmit} />;
}
