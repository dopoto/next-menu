import { formOptions } from '@tanstack/react-form/nextjs';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { PriceTierIdSchema } from '~/domain/price-tiers';
import { withMeta } from '~/lib/form-validation';
import { type locations } from '~/server/db/schema';

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;

export const locationIdSchema = z.coerce.number().positive().int();
export type LocationId = z.infer<typeof locationIdSchema>;

export const locationSlugSchema = z.coerce.string();
export type LocationSlug = z.infer<typeof locationSlugSchema>;

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

export const locationFormSchema = z.object({
    locationName: withMeta(
        z
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
        {
            label: 'Location name',
            placeholder: 'My fancy restaurant',
            description: 'The name of your location.',
        },
    ),
    currencyId: withMeta(
        z
            .string({
                required_error: 'Currency is required',
            })
            .min(3, 'Currency must be 3 characters')
            .max(3, 'Currency must be 3 characters'),
        {
            label: 'Currency',
            placeholder: 'Choose the currency name',
            description: 'The currency shown for menu items.',
        },
    ),
    priceTierId: PriceTierIdSchema,
    stripeSessionId: z.string(),
});
