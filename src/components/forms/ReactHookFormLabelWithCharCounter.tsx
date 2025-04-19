import { ZodOptional, type ZodString } from 'zod';
import { Badge } from '~/components/ui/badge';
import { FormLabel } from '~/components/ui/form';

function getMaxLength(schema: ZodString | ZodOptional<ZodString>): number {
    const stringSchema = schema instanceof ZodOptional ? schema.unwrap() : schema;
    return stringSchema._def?.checks?.find((check) => check.kind === 'max')?.value ?? 0;
}

export function ReactHookFormLabelWithCharCounter(props: { form: any; label: string; fieldName: string; schema: any }) {
    const shape = props.schema.shape[props.fieldName];
    const maxLength = getMaxLength(shape);

    return (
        <div className="flex justify-between align-middle items-center-safe">
            <FormLabel>{props.label}</FormLabel>
            <Badge variant={'outline'} className="text-xs font-light">
                {maxLength - (props.form.watch(props.fieldName)?.length || 0)} chars left
            </Badge>
        </div>
    );
}
