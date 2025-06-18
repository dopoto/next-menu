'use server';

import * as Sentry from '@sentry/nextjs';
import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { headers } from 'next/headers';
import { notifyOrderUpdated } from '~/app/api/realtime/notifications';
import { OrderItem, orderItemIdSchema, type DeliveryStatusId } from '~/domain/order-items';
import { type PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';

export const updateOrderItemDeliveryStatusAction = async (
    locationId: number,
    orderItemId: number,
    status: DeliveryStatusId,
): Promise<PublicOrderWithItems> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'updateOrderItemDeliveryStatusAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            //TODO try / catch ,change return

            const orderItemIdValidationResult = orderItemIdSchema.safeParse(orderItemId);
            if (!orderItemIdValidationResult.success) {
                throw new AppError({ publicMessage: `Invalid order item id` });
            }
            const validatedOrderItemId = orderItemIdValidationResult.data;

            const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId })

            const updatedItem = { orderId: "1" } as unknown as OrderItem // TODO  = await updateOrderItemStatus(locationId, validatedOrderItemId, status);
            if (!updatedItem) {
                throw new AppError({ internalMessage: 'Could not update order item' });
            }

            //const order = await getOrderById(locationId, updatedItem.orderId);
            const order = await fetchQuery(api.orders.getOrderByUserFriendlyId, { userFriendlyOrderId: updatedItem.orderId.toString() }) //TODO

            if (!order) {
                throw new AppError({ internalMessage: 'Order not found after update' });
            }

            //TODO 
            // await notifyOrderUpdated(locationId, {
            //     ...order,
            //     items: order.items.map((item) => ({
            //         menuItemId: item.menuItemId,
            //         orderItem: {
            //             id: item.orderItem.id,
            //             deliveryStatus: item.orderItem.deliveryStatus,
            //             isPaid: item.orderItem.isPaid,
            //         },
            //     })),
            // });

            return order as unknown as PublicOrderWithItems; //TODO
        },
    );
};
