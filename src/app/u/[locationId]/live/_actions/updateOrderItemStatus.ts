'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { notifyOrderUpdated } from '~/app/api/realtime/notifications';
import { type LocationId } from '~/domain/locations';
import { type OrderItemStatus } from '~/domain/order-items';
import { type OrderId } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { menuItems, orderItems, orders } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

type OrderItem = InferSelectModel<typeof orderItems> & {
    menuItem: InferSelectModel<typeof menuItems>;
};

type Order = InferSelectModel<typeof orders> & {
    orderItems: OrderItem[];
};

export async function updateOrderItemStatus(
    locationId: LocationId,
    orderId: OrderId,
    menuItemId: number,
    status: OrderItemStatus,
) {
    const { userId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    // Parse orderId to number since it might come as string from the frontend
    const orderIdNum = parseInt(orderId.toString(), 10);
    if (isNaN(orderIdNum)) {
        throw new AppError({ internalMessage: 'Invalid order ID' });
    }

    // Verify that the location belongs to the current user's organization
    await getLocationForCurrentUserOrThrow(locationId);

    // Update the order item status
    const [updatedItem] = await db
        .update(orderItems)
        .set({
            status,
            updatedAt: new Date(),
        })
        .where(and(eq(orderItems.orderId, orderIdNum), eq(orderItems.menuItemId, menuItemId)))
        .returning();

    if (!updatedItem) {
        throw new AppError({ internalMessage: 'Could not update order item' });
    }

    // Get the full updated order with items and menu items
    const foundOrders = (await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.id, orderIdNum),
        with: {
            orderItems: {
                columns: {
                    id: true,
                    status: true,
                    orderId: true,
                    menuItemId: true,
                },
                with: {
                    menuItem: {
                        columns: {
                            id: true,
                            name: true,
                            price: true,
                        },
                    },
                },
            },
        },
    })) as Order[];

    const order = foundOrders[0];
    if (!order || !order.orderItems) {
        throw new AppError({ internalMessage: 'Could not find order' });
    }

    // Send real-time notification
    await notifyOrderUpdated(locationId, {
        ...order,
        orderId: order.id.toString(),
        items: order.orderItems.map((item: OrderItem) => ({
            menuItem: {
                id: item.menuItem.id,
                name: item.menuItem.name ?? '',
                price: item.menuItem.price,
            },
            status: item.status as OrderItemStatus,
        })),
    });

    revalidatePath(`/u/${locationId}/live`);
    return order;
}
