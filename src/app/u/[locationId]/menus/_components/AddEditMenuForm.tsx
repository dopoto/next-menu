import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { PreviewMenu } from '~/app/u/[locationId]/menus/_components/PreviewMenu';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { type LocationId } from '~/domain/locations';
import { menuItemFormSchema } from '~/domain/menu-items';
import { menuFormSchema } from '~/domain/menus';
import { ROUTES } from '~/lib/routes';

export function AddEditMenuForm({
    form,
    onSubmit,
    locationId,
}: {
    form: UseFormReturn<z.infer<typeof menuFormSchema>>;
    onSubmit: (values: z.infer<typeof menuFormSchema>) => Promise<void>;
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
