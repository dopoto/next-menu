import type { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { type MenuItemId } from '../domain/menu-items';
import { Doc, Id } from 'convex/_generated/dataModel';
import { Location } from '~/domain/locations';


// export const PREPAID_STATUSES = ['draft', 'paid'] as const;
// export const POSTPAID_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
// export const ORDER_ITEM_STATUSES = [...new Set([...POSTPAID_STATUSES, ...PREPAID_STATUSES])] as const;

// type PostpaidOrderItemStatus = (typeof POSTPAID_STATUSES)[number];
// type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

// export type OrderItemStatus = PostpaidOrderItemStatus | PrepaidOrderItemStatus;

export const deliveryStatusValues = ['pending', 'delivered', 'canceled'] as const;
export type DeliveryStatusId = (typeof deliveryStatusValues)[number];


type OrderItemDoc = Doc<"orderItems">

export type OrderItem = Omit<OrderItemDoc, 'deliveryStatus'> & {
    deliveryStatus?: DeliveryStatusId;
};

export type NewOrderItem = Omit<OrderItem, '_id'>;

export type OrderItemId = Id<'orderItems'>
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
