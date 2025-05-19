'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { notifyOrderUpdated } from '~/app/api/realtime/notifications';
import { type LocationId } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { getOrderById } from '~/server/queries/orders';

// type OrderItem = InferSelectModel<typeof orderItems> & {
//     menuItem: InferSelectModel<typeof menuItems>;
// };

export async function markOrderItemAsDeliveredAction(locationId: LocationId, orderItemId: number) {
    const { userId } = await auth(); //TODO needed?
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    // Verify that the location belongs to the current user's organization
    await getLocationForCurrentUserOrThrow(locationId);

    // TODO Check that the order item id is in the order items for the location

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
            menuItem: {
                id: item.menuItem.id,
                name: item.menuItem.name ?? '',
                price: item.menuItem.price,
            },
            orderItem: {
                id: item.orderItem.id,
                isDelivered: item.orderItem.isDelivered,
                isPaid: item.orderItem.isPaid,
            },
        })),
    });

    // revalidatePath(`/u/${locationId}/live`); //TODO
    return order;
}
