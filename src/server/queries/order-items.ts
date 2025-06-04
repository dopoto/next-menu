import { eq } from 'drizzle-orm';
import type { LocationId } from '~/domain/locations';
import type { DeliveryStatusId, OrderItem, OrderItemId } from '~/domain/order-items';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems, orders } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

export async function updateOrderItemStatus(locationId: LocationId, orderItemId: OrderItemId, status: DeliveryStatusId): Promise<OrderItem> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    // First verify that the order item belongs to this location through its order
    const orderItem = await db.query.orderItems.findFirst({
        where: eq(orderItems.id, orderItemId),
        with: {
            order: {
                columns: {
                    locationId: true
                }
            }
        }
    });

    if (!orderItem || orderItem.order.locationId !== validLocation.id) {
        throw new AppError({
            publicMessage: 'Order item not found.',
            internalMessage: `Order item ${orderItemId} not found or does not belong to location ${locationId}`,
        });
    }

    const [updatedOrderItem] = await db
        .update(orderItems)
        .set({
            deliveryStatus: status,
            updatedAt: new Date(),
        })
        .where(eq(orderItems.id, orderItemId))
        .returning();

    if (!updatedOrderItem) {
        throw new AppError({
            publicMessage: 'Failed to update order item',
            internalMessage: `Failed to update order item ${orderItemId}`,
        });
    }

    return updatedOrderItem;
}
