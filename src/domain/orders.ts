import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { type CurrencyId } from '~/domain/currencies';
import { type PublicOrderItem } from '~/domain/order-items';
import { type orders } from '~/server/db/schema';

export const PREPAID_STATUSES = ['draft', 'paid'] as const;

export type Order = InferSelectModel<typeof orders>;

export type OrderId = Order['id'];
export const orderIdSchema = z.custom<OrderId>();

export const orderFormSchema = z.object({
    orderId: orderIdSchema.optional(),
    locationId: z
        .number({
            required_error: 'Location ID is required',
        })
        .min(0, 'Location Id must be positive'),
    items: z.array(z.custom<PublicOrderItem>()),
});


export type PublicOrderWithItems = Order & {
    currencyId: CurrencyId
    items: PublicOrderItem[];
};

export const publicOrderWithItemsSchema = z.object({
    ...orderFormSchema.shape,
    currencyId: z.custom<CurrencyId>(),
    items: z.array(z.custom<PublicOrderItem>()),
});