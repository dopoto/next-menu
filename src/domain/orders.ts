import { Doc, Id } from 'convex/_generated/dataModel';
import { z } from 'zod';
import { type CurrencyId } from '~/domain/currencies';
import { type PublicOrderItem } from '~/domain/order-items';

export const PREPAID_STATUSES = ['draft', 'paid'] as const;

type OrderDoc = Doc<"orders">;

export type Order = OrderDoc;

export type OrderId = Id<'orders'>;
export const orderIdSchema = z.custom<OrderId>();

export const orderFormSchema = z.object({
    id: orderIdSchema.optional(),
    locationId: z.number({ required_error: 'Location ID is required' }).min(0, 'Location Id must be positive'),
    items: z.array(z.custom<PublicOrderItem>()),
});

export type PublicOrderWithItems = Order & {
    currencyId: CurrencyId;
    items: PublicOrderItem[];
};
export type NewPublicOrderWithItems = Omit<PublicOrderWithItems, '_id' | 'updatedAt'>;

export const publicOrderWithItemsSchema = z.object({
    ...orderFormSchema.shape,
    currencyId: z.custom<CurrencyId>(),
    items: z.array(z.custom<PublicOrderItem>()),
});
