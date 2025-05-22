import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { type CurrencyId } from '~/domain/currencies';
import { withMeta } from '~/lib/form-validation';
import { type locations } from '~/server/db/schema';
import { menuModeValues, type MenuModeId } from './menu-modes';

export type Location = Omit<InferSelectModel<typeof locations>, 'menuMode' | 'currencyId'> & {
    menuMode: MenuModeId;
    currencyId: CurrencyId;
};
export type NewLocation = InferInsertModel<typeof locations>;

export const locationIdSchema = z.coerce.number().positive().int();
export type LocationId = z.infer<typeof locationIdSchema>;

export const LOCATION_SLUG_LENGTH = 8;
export const locationSlugSchema = z.coerce
    .string()
    .length(LOCATION_SLUG_LENGTH, { message: `Slug must be exactly ${LOCATION_SLUG_LENGTH} characters long` });
export type LocationSlug = z.infer<typeof locationSlugSchema>;

export type AddLocationFormData = {
    locationName: string;
    priceTierId: string;
    stripeSessionId: string;
};

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
            description: 'The name of your location',
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
            description: 'The currency shown for menu items',
        },
    ),

    menuMode: withMeta(
        z.enum(menuModeValues, {
            required_error: 'Menu mode is required',
        }),
        {
            label: 'Menu mode',
            placeholder: 'Choose the menu mode',
            description: 'The operation mode of menus in this location',
        },
    ),
});
