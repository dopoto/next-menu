import { and, desc, eq } from 'drizzle-orm';
import { type z } from 'zod';
import { LocationId } from '~/domain/locations';
import { type MenuItemId } from '~/domain/menu-items';
import { Menu, menuFormSchema, type MenuId } from '~/domain/menus';
import { AppError } from '~/lib/errors';
import { db } from '~/server/db';
import { menuItemsToMenus, menus } from '~/server/db/schema';
import { getLocation } from '~/server/queries/location';

function validateAndFormatMenuData(data: z.infer<typeof menuFormSchema>) {
    return {
        name: data.name,
        locationId: data.locationId,
    };
}

export async function createMenu(data: z.infer<typeof menuFormSchema>) {
    // Needed - performs security checks and throws on failure.
    await getLocation(data.locationId);

    const dbData = validateAndFormatMenuData(data);
    await db.insert(menus).values(dbData);
}

export async function updateMenu(menuId: MenuId, data: z.infer<typeof menuFormSchema>) {
    const validLocation = await getLocation(data.locationId);
    const dbData = validateAndFormatMenuData(data);
    const result = await db
        .update(menus)
        .set(dbData)
        .where(and(eq(menus.locationId, validLocation.id), eq(menus.id, menuId)));

    if (result.rowCount === 0) {
        const internalMessage = `Menu with ID ${menuId} not found or not authorized for update`;
        throw new AppError({ internalMessage });
    }
}

export async function deleteMenu(locationId: LocationId, menuId: MenuId) {
    const validLocation = await getLocation(locationId);
    const result = await db.delete(menus).where(and(eq(menus.locationId, validLocation.id), eq(menus.id, menuId)));

    if (result.rowCount === 0) {
        const internalMessage = `Menu with ID ${menuId} not found or not authorized for deletion`;
        throw new AppError({ internalMessage });
    }
}

export async function addMenuItemToMenu(menuId: MenuId, menuItemId: MenuItemId) {
    const menu = await db.query.menus.findFirst({
        where: eq(menus.id, menuId),
    });

    if (!menu) {
        throw new AppError({ internalMessage: 'Menu not found' });
    }

    const existingItem = await db.query.menuItemsToMenus.findFirst({
        where: and(eq(menuItemsToMenus.menuId, menuId), eq(menuItemsToMenus.menuItemId, menuItemId)),
    });

    if (existingItem) {
        throw new AppError({ internalMessage: 'Menu item already exists in menu' });
    }

    const maxSortOrder = await db.query.menuItemsToMenus.findFirst({
        where: eq(menuItemsToMenus.menuId, menuId),
        orderBy: desc(menuItemsToMenus.sortOrderIndex),
    });

    await db.insert(menuItemsToMenus).values({
        menuId,
        menuItemId,
        sortOrderIndex: (maxSortOrder?.sortOrderIndex ?? -1) + 1,
    });
}

export async function getMenuById(locationId: LocationId, menuId: MenuId): Promise<Menu | null> {
    const validLocation = await getLocation(locationId);
    if (!validLocation) {
        throw new AppError({
            internalMessage: `Location not found: ${locationId}`,
        });
    }

    const result = await db.query.menus.findFirst({
        where: and(eq(menus.id, menuId), eq(menus.locationId, validLocation.id)),
        with: {
            items: true,
        },
    });

    if (!result) {
        return null;
    }

    return result;
}
