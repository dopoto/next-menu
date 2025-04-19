import { ZodOptional, type ZodString } from 'zod';
import { ReactHookFormLabelWithCharCounter } from '~/components/forms/ReactHookFormLabelWithCharCounter';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';

function getMaxLength(schema: ZodString | ZodOptional<ZodString>): number {
    const stringSchema = schema instanceof ZodOptional ? schema.unwrap() : schema;
    return stringSchema._def?.checks?.find((check) => check.kind === 'max')?.value ?? 0;
}

export function ReactHookFormField(props: { schema: any; form: any; fieldName: string }) {
    const { schema, form, fieldName } = props;

    const shape = props.schema.shape[props.fieldName];
    const maxLength = getMaxLength(shape);
    const meta = (shape)._def.meta;

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <ReactHookFormLabelWithCharCounter
                        form={form}
                        label={meta.label}
                        fieldName={fieldName}
                        schema={schema}
                    />
                    <FormControl>
                        <Input placeholder={meta.placeholder} {...field} maxLength={maxLength} />
                    </FormControl>
                    <FormDescription>{meta.description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
