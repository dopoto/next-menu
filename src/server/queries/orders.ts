import { sql } from 'drizzle-orm';
import { type z } from 'zod';
import type { LocationId } from '~/domain/locations';
import { type DeliveryStatusId, type OrderItem, type PublicOrderItem } from '~/domain/order-items';
import {
    orderIdSchema,
    type OrderId,
    type PublicOrderWithItems,
    type publicOrderWithItemsSchema,
} from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems, orders } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

// function generateUniqueOrderNumber(): string {
//     const timestamp = new Date().getTime().toString(36).toUpperCase();
//     const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
//     return `ORD-${timestamp}${randomStr}`;
// }

export async function createOrder(data: z.infer<typeof publicOrderWithItemsSchema>): Promise<PublicOrderWithItems> {
    const validLocation = await getLocationForCurrentUserOrThrow(data.locationId);
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
        const pending: DeliveryStatusId = 'pending';
        if (data.items) {
            for (const item of data.items) {
                const [insertedItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: order.id,
                        menuItemId: item.menuItemId,
                        deliveryStatus: pending,
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
                            deliveryStatus: pending,
                            isPaid: false,
                        },
                    };
                    insertedItems.push(insertedPublicItem);
                }
            }
        }
        const orderWithItems: PublicOrderWithItems = {
            ...order,
            currencyId: validLocation.currencyId,
            items: insertedItems,
        };
        return orderWithItems;
    });
}

export async function updateOrder(data: z.infer<typeof publicOrderWithItemsSchema>): Promise<PublicOrderWithItems> {
    const validLocation = await getLocationForCurrentUserOrThrow(data.locationId);

    const orderIdValidationResult = orderIdSchema.safeParse(data.id);
    if (!orderIdValidationResult.success) {
        throw new AppError({ publicMessage: `Invalid Order ID` });
    }
    const validatedOrderId = orderIdValidationResult.data;

    return await db.transaction(async (tx) => {
        const itemsToInsert = data.items?.filter((item) => item.orderItem.id === undefined) ?? [];
        const itemsAlreadyOrdered = data.items?.filter((item) => item.orderItem.id !== undefined) ?? [];
        const insertedItems: PublicOrderItem[] = [];
        const pending: DeliveryStatusId = 'pending';
        if (itemsToInsert) {
            for (const item of itemsToInsert) {
                const [insertedItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: validatedOrderId,
                        menuItemId: item.menuItemId,
                        deliveryStatus: pending,
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
                            deliveryStatus: pending,
                            isPaid: false,
                        },
                    };
                    insertedItems.push(insertedPublicItem);
                }
            }
        }

        const order = await getOrderById(validLocation.id, validatedOrderId);

        if (!order) {
            throw new AppError({ internalMessage: 'Could not find order to update' });
        }

        const allItems = [...itemsAlreadyOrdered, ...insertedItems].sort((a, b) => {
            return (a.orderItem.id ?? 0) - (b.orderItem.id ?? 0);
        });

        const orderWithItems: PublicOrderWithItems = {
            ...order,
            currencyId: validLocation.currencyId,
            items: allItems,
        };
        return orderWithItems;
    });
}

export async function getOpenOrdersByLocation(locationId: LocationId): Promise<PublicOrderWithItems[]> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    const rows = await db.query.orders.findMany({
        with: { orderItems: true },
        where: (orders, { eq }) => eq(orders.locationId, locationId),
    });

    return rows.map((row): PublicOrderWithItems => {
        const items: PublicOrderItem[] = row.orderItems
            .map((orderItem) => ({
                menuItemId: orderItem.menuItemId,
                orderItem: {
                    id: orderItem.id,
                    deliveryStatus: orderItem.deliveryStatus as OrderItem['deliveryStatus'],
                    isPaid: orderItem.isPaid,
                },
            }))
            .sort((a, b) => {
                return (a.orderItem.id ?? 0) - (b.orderItem.id ?? 0);
            });

        return {
            ...row,
            currencyId: validLocation.currencyId,
            items,
        };
    });
}

export async function getOrderById(locationId: LocationId, orderId: OrderId): Promise<PublicOrderWithItems> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    const order = await db.query.orders.findFirst({
        where: (orders, { and, eq }) => and(eq(orders.locationId, validLocation.id), eq(orders.id, Number(orderId))),
        with: { orderItems: true },
    });

    if (!order) {
        throw new AppError({ internalMessage: 'Order not found' });
    }

    const orderWithItems: PublicOrderWithItems = {
        id: order.id,
        locationId: order.locationId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        currencyId: validLocation.currencyId,
        items: order.orderItems
            .map((orderItem) => ({
                menuItemId: orderItem.menuItemId,
                orderItem: {
                    id: orderItem.id,
                    deliveryStatus: orderItem.deliveryStatus as OrderItem['deliveryStatus'],
                    isPaid: orderItem.isPaid,
                },
            }))
            .sort((a, b) => {
                return (a.orderItem.id ?? 0) - (b.orderItem.id ?? 0);
            }),
    };
    return orderWithItems;
}
