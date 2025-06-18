import { Doc, type Id } from 'convex/_generated/dataModel';
import { z } from 'zod';
import { type CurrencyId } from '~/domain/currencies';
import { withMeta } from '~/lib/form-validation';
import { menuModeValues, type MenuModeId } from './menu-modes';

type LocationDoc = Doc<"locations">

export interface Location extends Omit<LocationDoc, 'currencyId' | 'menuMode'> {
    currencyId: CurrencyId;
    menuMode: MenuModeId;
}

export type NewLocation = Omit<Location, '_id'>;

export type LocationId = Id<"locations">;

export const locationZodSchema = z.object({
    _id: z.custom<Id<"locations">>(),
    _creationTime: z.number(),
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
        z.string().length(3),
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
}) satisfies z.ZodType<LocationDoc>;

// TODO usage? Type assertion to ensure our Zod schema matches our Location type
//type ValidateLocationTypes = typeof locationZodSchema._type extends Location ? true : never;
