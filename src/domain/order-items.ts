// export const PREPAID_STATUSES = ['draft', 'paid'] as const;
// export const POSTPAID_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
// export const ORDER_ITEM_STATUSES = [...new Set([...POSTPAID_STATUSES, ...PREPAID_STATUSES])] as const;

import type { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { type MenuItemId } from '~/domain/menu-items';
import { type orderItems } from '~/server/db/schema';

// type PostpaidOrderItemStatus = (typeof POSTPAID_STATUSES)[number];
// type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

// export type OrderItemStatus = PostpaidOrderItemStatus | PrepaidOrderItemStatus;

export const deliveryStatusValues = ['pending', 'delivered', 'canceled'] as const;
export type DeliveryStatusId = (typeof deliveryStatusValues)[number];

export type OrderItem = InferSelectModel<typeof orderItems>;

export type OrderItemId = OrderItem['id'];
export const orderItemIdSchema = z.custom<OrderItemId>();

export interface PublicOrderItem {
    menuItemId: MenuItemId;
    orderItem: {
        /**
         * Temporary client-side only ID for tracking items not ordered yet.
         */
        tempId?: string;
        id?: OrderItemId;
    } & Pick<OrderItem, 'deliveryStatus' | 'isPaid'>;
}
