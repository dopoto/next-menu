import { formOptions } from '@tanstack/react-form/nextjs';
import { z } from 'zod';
import { PriceTierIdSchema } from '~/domain/price-tiers';

export type AddLocationFormData = {
    locationName: string;
    priceTierId: string;
    stripeSessionId: string;
};

/**
 * @see https://tanstack.com/form/v1/docs/framework/react/guides/ssr#using-tanstack-form-in-a-nextjs-app-router.
 */
export const addLocationFormOptions = formOptions({
    defaultValues: {
        locationName: '',
        priceTierId: '',
        stripeSessionId: '',
    },
});

export const addLocationFormDataSchema = z.object({
    locationName: z
        .string({
            required_error: 'Location Name is required',
            invalid_type_error: 'Location Name must be a string',
        })
        .min(2, {
            message: 'Location Name must be 2 or more characters long',
        })
        .max(256, {
            message: 'Location Name must be 256 or fewer characters long',
        }),
    priceTierId: PriceTierIdSchema,
    stripeSessionId: z.string(),
});
