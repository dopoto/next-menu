import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { CurrencyId } from '~/domain/currencies';
import { PublicOrderItem } from '~/domain/order-items';

import { orders } from '~/server/db/schema';

export const PREPAID_STATUSES = ['draft', 'paid'] as const;

export type Order = InferSelectModel<typeof orders>;

export type PublicOrder = z.infer<typeof orderFormSchema> & { currencyId: CurrencyId };

export type PublicOrderWithItems = Order & {
    items: PublicOrderItem[];
};

export const orderIdSchema = z.coerce.string();
export type OrderId = z.infer<typeof orderIdSchema>;

export const orderFormSchema = z.object({
    orderId: z.string().optional(),
    locationId: z
        .number({
            required_error: 'Location ID is required',
        })
        .min(0, 'Location Id must be positive'),
    items: z.array(z.custom<PublicOrderItem>()),
});
