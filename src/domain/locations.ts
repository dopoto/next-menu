import { Doc, type Id } from 'convex/_generated/dataModel';
import { z } from 'zod';
import { type CurrencyId } from '~/domain/currencies';
import { withMeta } from '~/lib/form-validation';
import { menuModeValues, type MenuModeId } from './menu-modes';

type LocationDoc = Doc<"locations">

export type Location = Omit<LocationDoc, 'currencyId' | 'menuMode'> & {
    currencyId: CurrencyId;
    menuMode: MenuModeId;
}
export type NewLocation = Omit<Location, '_id'>;

export type LocationId = Id<"locations">;
export const locationIdSchema = z.custom<LocationId>();

export type LocationForm = Omit<Location, '_id' | '_creationTime'>;
export const locationFormSchema = z.object({
    name: withMeta(
        z.string().min(2).max(256),
        {
            label: 'Location name',
            placeholder: 'My fancy restaurant',
            description: 'The name of your location',
        }
    ),
    slug: z.string(),
    currencyId: withMeta(
        z.custom<CurrencyId>(),
        {
            label: 'Currency',
            placeholder: 'Choose the currency name',
            description: 'The currency shown for menu items',
        }
    ),
    menuMode: withMeta(
        z.enum(menuModeValues),
        {
            label: 'Menu mode',
            placeholder: 'Choose the menu mode',
            description: 'The operation mode of menus in this location',
        }
    ),
    orgId: z.custom<Id<"organizations">>(),
    updatedAt: z.number(),
}) satisfies z.ZodType<LocationForm>;

export const LOCATION_SLUG_LENGTH = 8;
export const locationSlugSchema = z.coerce
    .string()
    .length(LOCATION_SLUG_LENGTH, { message: `Slug must be exactly ${LOCATION_SLUG_LENGTH} characters long` });
export type LocationSlug = z.infer<typeof locationSlugSchema>;

// TODO usage? Type assertion to ensure our Zod schema matches our Location type
//type ValidateLocationTypes = typeof locationZodSchema._type extends Location ? true : never;
