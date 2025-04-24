import { and, eq } from 'drizzle-orm';
import { type z } from 'zod';
import { type LocationId } from '~/domain/location';
import { AppError } from '~/lib/error-utils.server';
import {
    type MenuItem,
    type menuItemFormSchema,
    type MenuItemId,
    validateAndFormatMenuItemData,
} from '~/lib/menu-items';
import { db } from '~/server/db';
import { menuItems } from '~/server/db/schema';
import { getLocation } from '~/server/queries/location';

export async function getMenuItemsByLocation(locationId: LocationId): Promise<MenuItem[]> {
    const validLocation = await getLocation(locationId);
    const items = await db.query.menuItems.findMany({
        where: (menuItems, { eq }) => eq(menuItems.locationId, validLocation.id),
        orderBy: (menuItems, { desc }) => desc(menuItems.name),
    });

    return items;
}

export async function getMenuItemById(locationId: LocationId, menuItemId: MenuItemId): Promise<MenuItem | undefined> {
    const validLocation = await getLocation(locationId);
    const item = await db.query.menuItems.findFirst({
        where: (menuItems, { and, eq }) =>
            and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)),
        orderBy: (menuItems, { desc }) => desc(menuItems.name),
    });

    return item;
}

export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
    // Needed - performs security checks and throws on failure.
    await getLocation(data.locationId);

    const dbData = validateAndFormatMenuItemData(data);
    await db.insert(menuItems).values(dbData);
}

export async function updateMenuItem(menuItemId: MenuItemId, data: z.infer<typeof menuItemFormSchema>) {
    const validLocation = await getLocation(data.locationId);
    const dbData = validateAndFormatMenuItemData(data);
    const result = await db
        .update(menuItems)
        .set(dbData)
        .where(and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)));

    if (result.rowCount === 0) {
        const internalMessage = `Menu item with ID ${menuItemId} not found or not authorized for update`;
        throw new AppError({ internalMessage });
    }
}

export async function deleteMenuItem(locationId: LocationId, menuItemId: MenuItemId) {
    const validLocation = await getLocation(locationId);
    const result = await db
        .delete(menuItems)
        .where(and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)));

    if (result.rowCount === 0) {
        const internalMessage = `Menu item with ID ${menuItemId} not found or not authorized for deletion`;
        throw new AppError({ internalMessage });
    }
}
