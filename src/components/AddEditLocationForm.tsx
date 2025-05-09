'use client';
 
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { SelectControl, SelectControlOptions } from '~/components/SelectControl';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { CURRENCIES } from '~/domain/currencies';
import { editLocationFormSchema } from '~/domain/locations';

export function AddEditLocationForm(props: {
    form: UseFormReturn<z.infer<typeof editLocationFormSchema>>;
    onSubmit: (values: z.infer<typeof editLocationFormSchema>) => Promise<void>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof editLocationFormSchema>) => {
        setIsSubmitting(true);
        try {
            await props.onSubmit({ ...values  });
        } finally {
            setIsSubmitting(false);
        }
    };

    const options: SelectControlOptions = Object.entries(CURRENCIES).map(([code, currency]) => ({
        value: code,
        label: (
            <span className="flex text-xs gap-1.5 items-center">
                <Badge variant={'secondary'} className="border-1 border-gray-300 flex justify-between" style={{ width: '70px' }}>
                    <span className="font-light">{currency.code}</span> {currency.symbol_native}
                </Badge>
                <span>{currency.name}</span>
            </span>
        ),
        searchLabel: `${currency.name} ${currency.symbol}  ${currency.symbol_native}   ${currency.code}`,
    }));

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            <Form {...props.form}>
                <form onSubmit={props.form.handleSubmit(handleSubmit)} className="space-y-8">
                    {props.form.formState.errors.root && (
                        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500">
                            {props.form.formState.errors.root.message}
                        </div>
                    )}

                    <ReactHookFormField schema={editLocationFormSchema} form={props.form} fieldName={'locationName'} />
 
                    <FormField  
                        control={props.form.control}
                        name="currencyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <SelectControl 
                                    id="currencyId" 
                                    options={options} 
                                    value={field.value ? options.find(opt => opt.value === field.value) : undefined} 
                                    onChange={(newValue) => field.onChange(newValue?.value)} 
                                />
                                <FormDescription>The currency used by menus in this location.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>                         
                    </div>
                </form>
            </Form>
        </div>
    );
}
