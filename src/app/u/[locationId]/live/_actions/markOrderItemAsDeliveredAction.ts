'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { notifyOrderUpdated } from '~/app/api/realtime/notifications';
import { type LocationId } from '~/domain/locations';
import { TAGS } from '~/domain/tags';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { getOrderById } from '~/server/queries/orders';

// type OrderItem = InferSelectModel<typeof orderItems> & {
//     menuItem: InferSelectModel<typeof menuItems>;
// };

export async function markOrderItemAsDeliveredAction(locationId: LocationId, orderItemId: number) {
    // Verify that the location belongs to the current user's organization
    await getLocationForCurrentUserOrThrow(locationId);

    // TODO Check that the order item id is in the order items for the location

    // TODO move to queries
    // Update the order item status
    const [updatedItem] = await db
        .update(orderItems)
        .set({
            isDelivered: true,
            updatedAt: new Date(),
        })
        .where(eq(orderItems.id, orderItemId))
        .returning();

    if (!updatedItem) {
        throw new AppError({ internalMessage: 'Could not update order item' });
    }

    // Get the full updated order with items and menu items
    //const foundOrders =  await getOpenOrdersByLocation(locationId)

    // Send real-time notification
    // Fetch the full order with its items after updating
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
                isDelivered: item.orderItem.isDelivered,
                isPaid: item.orderItem.isPaid,
            },
        })),
    });

    revalidateTag(TAGS.locationOpenOrders(locationId));

    return order;
}
