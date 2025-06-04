import { sql, eq } from 'drizzle-orm';
import type { z } from 'node_modules/zod/dist/types/v3/external';
import type { LocationId, locationFormSchema } from '~/domain/locations';
import type { DeliveryStatusId, OrderItem, OrderItemId } from '~/domain/order-items';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { locations, orderItems } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

export async function updateOrderItemStatus(locationId: LocationId, orderItemId: OrderItemId, status: DeliveryStatusId): Promise<OrderItem> {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    await db.transaction(async (tx) => {
        const result = await tx
            .update(orderItems)
            .set({
                deliveryStatus: status,
                updatedAt: new Date(),
            })
            .where(eq(orderItems.id, orderItemId))
            .returning();

        // .update(locations)
        // .set({
        //     name: data.locationName,
        //     currencyId: data.currencyId,
        //     menuMode: data.menuMode,
        //     updatedAt: sql`CURRENT_TIMESTAMP`,
        // })
        // .where(eq(locations.id, validLocation.id));

        return result;
    });
}
