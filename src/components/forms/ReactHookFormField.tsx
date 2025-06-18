/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type ZodObject, ZodOptional, type ZodRawShape, type ZodString } from 'zod';
import { ReactHookFormLabelWithCharCounter } from '~/components/forms/ReactHookFormLabelWithCharCounter';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';

interface ZodMaxCheck {
    kind: 'max';
    value: number;
    message?: string;
}

function getMaxLength(schema?: ZodString | ZodOptional<ZodString>): number {
    const stringSchema = schema instanceof ZodOptional ? schema.unwrap() : schema;
    const maxCheck = stringSchema?._def?.checks?.find((check): check is ZodMaxCheck => check.kind === 'max');
    return maxCheck?.value ?? 0;
}

export function ReactHookFormField(props: { schema: ZodObject<ZodRawShape>; form: any; fieldName: string }) {
    const { schema, form, fieldName } = props;

    const shape = props.schema.shape[props.fieldName];
    const maxLength = shape ? getMaxLength(shape as ZodString | ZodOptional<ZodString>) : 0;
    const { label, placeholder, description } = shape?._def?.meta ?? { label: '', placeholder: '', description: '' };

    console.log(props.fieldName);
    console.log(JSON.stringify(props.schema, null, 2));
    console.log(shape);

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <ReactHookFormLabelWithCharCounter
                        form={form}
                        label={label}
                        fieldName={fieldName}
                        schema={schema}
                        maxLength={maxLength}
                    />
                    <FormControl>
                        <Input placeholder={placeholder} {...field} maxLength={maxLength} />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
