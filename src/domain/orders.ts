import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { PublicOrderItem } from '~/app/p/[locationSlug]/_state/cart';
import { orders } from '~/server/db/schema';

export const PREPAID_STATUSES = ['draft', 'paid'] as const;

export type Order = InferSelectModel<typeof orders>;
export type OrderWithItems = Order & {
    items: PublicOrderItem[];
    orderId?: string;
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
