// export const PREPAID_STATUSES = ['draft', 'paid'] as const;
// export const POSTPAID_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
// export const ORDER_ITEM_STATUSES = [...new Set([...POSTPAID_STATUSES, ...PREPAID_STATUSES])] as const;

import type { InferSelectModel } from 'drizzle-orm';
import { MenuItem, type MenuItemId } from '~/domain/menu-items';
import { type orderItems } from '~/server/db/schema';

// type PostpaidOrderItemStatus = (typeof POSTPAID_STATUSES)[number];
// type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

// export type OrderItemStatus = PostpaidOrderItemStatus | PrepaidOrderItemStatus;

export type OrderItem = InferSelectModel<typeof orderItems>;

export interface PublicOrderItem {
    menuItemId: MenuItemId;
    orderItem: { id?: OrderItem['id'] } & Pick<OrderItem, 'isDelivered' | 'isPaid'>;
}
