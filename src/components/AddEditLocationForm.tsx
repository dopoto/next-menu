'use client';

import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type z } from 'zod';
import { ReactHookFormField } from '~/components/forms/ReactHookFormField';
import { SelectControl, type SelectControlOptions } from '~/components/SelectControl';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { CURRENCIES } from '~/domain/currencies';
import { locationFormSchema } from '~/domain/locations';
import { MENU_MODES } from '~/domain/menu-modes';

export function AddEditLocationForm(props: {
    form: UseFormReturn<z.infer<typeof locationFormSchema>>;
    onSubmit: (values: z.infer<typeof locationFormSchema>) => Promise<void>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof locationFormSchema>) => {
        setIsSubmitting(true);
        try {
            await props.onSubmit({ ...values });
        } finally {
            setIsSubmitting(false);
        }
    };

    const options: SelectControlOptions = Object.entries(CURRENCIES).map(([code, currency]) => ({
        value: code,
        label: (
            <span className="flex text-xs gap-2 items-center">
                <Badge
                    variant={'secondary'}
                    className="border-1 border-gray-300 dark:border-gray-600 flex justify-between"
                    style={{ width: '70px' }}
                >
                    <span className="font-light">{currency.code}</span> {currency.symbol_native}
                </Badge>
                <span className="text-primary">{currency.name}</span>
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
                    <ReactHookFormField schema={locationFormSchema} form={props.form} fieldName={'locationName'} />
                    <FormField
                        control={props.form.control}
                        name="currencyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <SelectControl
                                    id="currencyId"
                                    options={options}
                                    value={field.value ? options.find((opt) => opt.value === field.value) : undefined}
                                    onChange={(newValue) => field.onChange(newValue?.value)}
                                />
                                <FormDescription>The currency used by menus in this location.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />{' '}
                    <FormField
                        control={props.form.control}
                        name="menuMode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Menu Mode</FormLabel>
                                <RadioGroup onValueChange={field.onChange} value={field.value ?? 'noninteractive'}>
                                    {Object.keys(MENU_MODES).map((k) => {
                                        const menuMode = MENU_MODES[k as keyof typeof MENU_MODES];
                                        if (!menuMode.isEnabled) {
                                            return null;
                                        }
                                        return (
                                            <div key={menuMode.id} className="flex items-center space-x-4 py-2">
                                                <RadioGroupItem value={menuMode.id} id={menuMode.id} />
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor={menuMode.id}>{menuMode.name}</Label>
                                                    <Label className="font-light" htmlFor={menuMode.id}>
                                                        {menuMode.description}
                                                    </Label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                                <FormDescription>Controls how customers can interact with your menus</FormDescription>
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
