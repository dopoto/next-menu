import { sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { type z } from 'zod';
import type { LocationId } from '~/domain/locations';
import { type PublicOrderItem } from '~/domain/order-items';
import { type orderFormSchema, type OrderId, type PublicOrderWithItems } from '~/domain/orders';
import { TAGS } from '~/domain/tags';
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

        const insertedItems: PublicOrderItem[] = [];
        if (data.items) {
            for (const item of data.items) {
                const [insertedItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: order.id,
                        menuItemId: item.menuItemId,
                        deliveryStatus: 'pending',
                        isPaid: false,
                        createdAt: sql`CURRENT_TIMESTAMP`,
                        updatedAt: sql`CURRENT_TIMESTAMP`,
                    })
                    .returning();
                if (insertedItem) {
                    const insertedPublicItem: PublicOrderItem = {
                        menuItemId: item.menuItemId,
                        orderItem: {
                            id: insertedItem.id,
                            deliveryStatus: 'pending',
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

export async function updateOrder(data: z.infer<typeof orderFormSchema>): Promise<PublicOrderWithItems> {
    return await db.transaction(async (tx) => {
        const itemsToInsert = data.items?.filter((item) => item.orderItem.id === undefined) ?? [];
        const itemsAlreadyOrdered = data.items?.filter((item) => item.orderItem.id !== undefined) ?? [];
        const insertedItems: PublicOrderItem[] = [];
        if (itemsToInsert) {
            for (const item of itemsToInsert) {
                const [insertedItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: Number(data.orderId), //TODO review
                        menuItemId: item.menuItemId,
                        deliveryStatus: 'pending',
                        isPaid: false,
                        createdAt: sql`CURRENT_TIMESTAMP`,
                        updatedAt: sql`CURRENT_TIMESTAMP`,
                    })
                    .returning();
                if (insertedItem) {
                    const insertedPublicItem: PublicOrderItem = {
                        menuItemId: item.menuItemId,
                        orderItem: {
                            id: insertedItem.id,
                            deliveryStatus: 'pending',
                            isPaid: false,
                        },
                    };
                    insertedItems.push(insertedPublicItem);
                }
            }
        }

        const [order] = await tx
            .select()
            .from(orders)
            .where(sql`${orders.id} = ${Number(data.orderId)}`);

        if (!order) {
            throw new AppError({ internalMessage: 'Order not found after update' });
        }

        const orderWithItems: PublicOrderWithItems = {
            ...order,
            items: [...itemsAlreadyOrdered, ...insertedItems].sort((a, b) => {
                return (a.orderItem.id ?? 0) - (b.orderItem.id ?? 0);
            }),
        };
        return orderWithItems;
    });
}

export const getOpenOrdersByLocation = async (locationId: LocationId): Promise<PublicOrderWithItems[]> => {
    const items = await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.locationId, locationId),
        with: {
            orderItems: true,
        },
    });

    const ordersWithItems: PublicOrderWithItems[] = items.map((order) => ({
        id: order.id,
        locationId: order.locationId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.orderItems
            .map((orderItem) => ({
                menuItemId: orderItem.menuItemId,
                orderItem: {
                    id: orderItem.id,
                    deliveryStatus: orderItem.deliveryStatus,
                    isPaid: orderItem.isPaid,
                    createdAt: orderItem.createdAt,
                },
            }))
            .sort((a, b) => {
                return a.orderItem.id - b.orderItem.id;
            }),
    }));
    return ordersWithItems;
}

export const getCachedOpenOrdersByLocation = async (locationId: LocationId): Promise<PublicOrderWithItems[]> => {
    // Validate location access before caching
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    return unstable_cache(
        async () => {
            const items = await getOpenOrdersByLocation(validLocation.id);
            return items;
        },
        [TAGS.locationOpenOrders(locationId)],
        {
            tags: [TAGS.locationOpenOrders(locationId)],
            revalidate: 60, // Cache for 60 seconds
        },
    )();
};

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
            menuItemId: orderItem.menuItemId,
            orderItem: {
                id: orderItem.id,
                deliveryStatus: orderItem.deliveryStatus,
                isPaid: orderItem.isPaid,
            },
        })).sort((a, b) => {
            return (a.orderItem.id ?? 0) - (b.orderItem.id ?? 0);
        }),
    };
    return orderWithItems;
}
