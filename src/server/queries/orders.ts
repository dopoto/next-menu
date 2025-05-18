import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { LocationId } from '~/domain/locations';
import { PublicOrderItem } from '~/domain/order-items';
import { orderFormSchema, OrderId, PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems, orders } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

// function generateUniqueOrderNumber(): string {
//     const timestamp = new Date().getTime().toString(36).toUpperCase();
//     const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
//     return `ORD-${timestamp}${randomStr}`;
// }

export async function createOrder(data: z.infer<typeof orderFormSchema>): Promise<PublicOrderWithItems> {
    return await db.transaction(async (tx) => {
        const [order] = await tx
            .insert(orders)
            .values({
                locationId: data.locationId,
                createdAt: sql`CURRENT_TIMESTAMP`,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .returning();

        if (!order) {
            throw new AppError({ internalMessage: 'Could not insert order' });
        }

        // if (data.items) {
        //     for (let i = 0; i < data.items.length; i++) {
        //         const item = data.items[i];
        //         await tx.insert(orderItems).values({
        //             orderId: order.id,
        //             menuItemId: item!.menuItem.id,
        //             isDelivered: false,
        //             isPaid: false,
        //             createdAt: sql`CURRENT_TIMESTAMP`,
        //             updatedAt: sql`CURRENT_TIMESTAMP`,
        //         });
        //     }
        // }
        const insertedItems: PublicOrderItem[] = [];
        if (data.items) {
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                const [insertedItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: order.id,
                        menuItemId: item!.menuItem.id,
                        isDelivered: false,
                        isPaid: false,
                        createdAt: sql`CURRENT_TIMESTAMP`,
                        updatedAt: sql`CURRENT_TIMESTAMP`,
                    })
                    .returning();
                if (insertedItem) {
                    const insertedPublicItem: PublicOrderItem = {
                        menuItem: {
                            id: item!.menuItem.id,
                            name: item!.menuItem.name,
                            price: item!.menuItem.price,
                        },
                        orderItem: {
                            id: insertedItem.id,
                            isDelivered: false,
                            isPaid: false,
                        },
                    };
                    insertedItems.push(insertedPublicItem);
                }
            }
        }
        const orderWithItems: PublicOrderWithItems = {
            ...order,
            items: insertedItems,
        };
        return orderWithItems;
    });
}

export async function getOpenOrdersByLocation(locationId: LocationId): Promise<PublicOrderWithItems[]> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);
    const items = await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.locationId, validLocation.id),
        with: {
            orderItems: true,
        },
    });

    const ordersWithItems: PublicOrderWithItems[] = items.map((order) => ({
        id: order.id,
        locationId: order.locationId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.orderItems.map((orderItem) => ({
            menuItem: {
                id: orderItem.menuItemId,
                // You may need to fetch menuItem name and price here if not included in orderItem
                name: '', // TODO Placeholder, replace with actual value if available
                price: '0', // TODO Placeholder, replace with actual value if available
            },
            orderItem: {
                id: orderItem.id,
                isDelivered: orderItem.isDelivered,
                isPaid: orderItem.isPaid,
            },
        })),
    }));
    return ordersWithItems;
}

export async function getOrderById(locationId: LocationId, orderId: OrderId): Promise<PublicOrderWithItems> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    const order = await db.query.orders.findFirst({
        where: (orders, { and, eq }) => and(eq(orders.locationId, validLocation.id), eq(orders.id, Number(orderId))),
        with: {
            orderItems: true,
        },
    });

    if (!order) {
        throw new AppError({ internalMessage: 'Order not found' });
    }

    const orderWithItems: PublicOrderWithItems = {
        id: order.id,
        locationId: order.locationId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.orderItems.map((orderItem) => ({
            menuItem: {
                id: orderItem.menuItemId,
                // You may need to fetch menuItem name and price here if not included in orderItem
                name: '', // TODO Placeholder, replace with actual value if available
                price: '0', // TODO Placeholder, replace with actual value if available
            },
            orderItem: {
                id: orderItem.id,
                isDelivered: orderItem.isDelivered,
                isPaid: orderItem.isPaid,
            },
        })),
    };
    return orderWithItems;
}
