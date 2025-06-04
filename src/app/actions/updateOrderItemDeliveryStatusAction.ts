'use server';

import * as Sentry from '@sentry/nextjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { notifyOrderUpdated } from '~/app/api/realtime/notifications';
import { orderItemIdSchema, type DeliveryStatusId } from '~/domain/order-items';
import { PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { updateOrderItemStatus } from '~/server/queries/order-items';
import { getOrderById } from '~/server/queries/orders';

export const updateOrderItemDeliveryStatusAction = async (
    locationId: number, orderItemId: number, status: DeliveryStatusId): Promise<PublicOrderWithItems> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'updateOrderItemDeliveryStatusAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {

            const orderItemIdValidationResult = orderItemIdSchema.safeParse(orderItemId);
            if (!orderItemIdValidationResult.success) {
                throw new AppError({ publicMessage: `Invalid order item id` });
            }
            const validatedOrderItemId = orderItemIdValidationResult.data;

            // Verify that the location belongs to the current user's organization
            await getLocationForCurrentUserOrThrow(locationId);

            // TODO Check that the order item id is in the order items for the location

            // TODO move to queries
            // Update the order item status
            // const [updatedItem] = await db
            //     .update(orderItems)
            //     .set({
            //         deliveryStatus: status,
            //         updatedAt: new Date(),
            //     })
            //     .where(eq(orderItems.id, validatedOrderItemId))
            //     .returning();

            const updatedItem = await updateOrderItemStatus(locationId, validatedOrderItemId, status);

            if (!updatedItem) {
                throw new AppError({ internalMessage: 'Could not update order item' });
            }

            const order = await getOrderById(locationId, updatedItem.orderId.toString());
            if (!order) {
                throw new AppError({ internalMessage: 'Order not found after update' });
            }

            await notifyOrderUpdated(locationId, {
                ...order,
                items: order.items.map((item) => ({
                    menuItemId: item.menuItemId,
                    orderItem: {
                        id: item.orderItem.id,
                        deliveryStatus: item.orderItem.deliveryStatus,
                        isPaid: item.orderItem.isPaid,
                    },
                })),
            });

            return order;
        }
    )
}
