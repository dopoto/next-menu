import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { orderFormSchema } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { orderItems, orders } from '~/server/db/schema';

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
                await tx.insert(orderItems).values({
                    orderId: order.id,
                    menuItemId: item!.menuItem.id,
                    status: 'draft',
                    createdAt: sql`CURRENT_TIMESTAMP`,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                });
            }
        }

        return order;
    });
}
