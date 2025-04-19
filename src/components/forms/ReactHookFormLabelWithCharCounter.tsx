/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type UseFormReturn } from 'react-hook-form';
import { type ZodObject, type ZodRawShape } from 'zod';
import { Badge } from '~/components/ui/badge';
import { FormLabel } from '~/components/ui/form';

export function ReactHookFormLabelWithCharCounter(props: {
    form: UseFormReturn;
    label: string;
    fieldName: string;
    schema: ZodObject<ZodRawShape>;
    maxLength: number;
}) {
    if (props.maxLength <= 0) {
        return null;
    }

    return (
        <div className="flex justify-between align-middle items-center-safe">
            <FormLabel>{props.label}</FormLabel>
            <Badge variant={'outline'} className="text-xs font-light">
                {props.maxLength - (props.form.watch(props.fieldName)?.length ?? 0)} chars left
            </Badge>
        </div>
    );
}
