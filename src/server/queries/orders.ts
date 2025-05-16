import { sql, type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import type { LocationId } from '~/domain/locations';
import { OrderItemStatus } from '~/domain/order-items';
import { orderFormSchema } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems, orders } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

// function generateUniqueOrderNumber(): string {
//     const timestamp = new Date().getTime().toString(36).toUpperCase();
//     const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
//     return `ORD-${timestamp}${randomStr}`;
// }

export async function createOrder(data: z.infer<typeof orderFormSchema>) {
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

        if (data.items) {
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                const status: OrderItemStatus = 'ordered';
                await tx.insert(orderItems).values({
                    orderId: order.id,
                    menuItemId: item!.menuItem.id,
                    status,
                    createdAt: sql`CURRENT_TIMESTAMP`,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                });
            }
        }

        return order;
    });
}

type OrderWithItems = InferSelectModel<typeof orders> & {
    orderItems: Array<InferSelectModel<typeof orderItems>>;
};

export async function getOpenOrdersByLocation(locationId: LocationId): Promise<OrderWithItems[]> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);
    const items = await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.locationId, validLocation.id),
        with: {
            orderItems: true, // fetch all columns of each orderItem
        },
    });

    return items;
}
