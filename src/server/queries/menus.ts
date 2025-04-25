import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { type z } from 'zod';
import { type LocationId } from '~/domain/locations';
import { type MenuItem, type MenuItemId } from '~/domain/menu-items';
import { type Menu, type menuFormSchema, type MenuId } from '~/domain/menus';
import { AppError } from '~/lib/errors';
import { db } from '~/server/db';
import { menuItems, menuItemsToMenus, menus } from '~/server/db/schema';
import { getLocation } from '~/server/queries/location';

export async function createMenu(data: z.infer<typeof menuFormSchema>) {
    // Needed - performs security checks and throws on failure.
    await getLocation(data.locationId);

    await db.transaction(async (tx) => {
        const [menu] = await tx
            .insert(menus)
            .values({
                name: data.name,
                locationId: data.locationId,
                createdAt: sql`CURRENT_TIMESTAMP`,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .returning();

        if (!menu) {
            throw new AppError({ internalMessage: 'Could not insert menu' });
        }

        if (data.items) {
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                await tx.insert(menuItemsToMenus).values({
                    menuId: menu.id,
                    menuItemId: item.id,
                    sortOrderIndex: i,
                    createdAt: sql`CURRENT_TIMESTAMP`,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                });
            }
        }

        return menu;
    });
}

export async function updateMenu(menuId: MenuId, data: z.infer<typeof menuFormSchema>) {
    const validLocation = await getLocation(data.locationId);
    
    await db.transaction(async (tx) => {
        // Update menu details
        const result = await tx
            .update(menus)
            .set({
                name: data.name,
                locationId: data.locationId,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .where(and(eq(menus.locationId, validLocation.id), eq(menus.id, menuId)));

        if (result.rowCount === 0) {
            const internalMessage = `Menu with ID ${menuId} not found or not authorized for update`;
            throw new AppError({ internalMessage });
        }

        // Handle menu items if provided
        if (data.items) {
            // Delete existing menu item associations
            await tx
                .delete(menuItemsToMenus)
                .where(eq(menuItemsToMenus.menuId, menuId));

            // Add new menu item associations with proper sort order
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                await tx.insert(menuItemsToMenus).values({
                    menuId: menuId,
                    menuItemId: item.id,
                    sortOrderIndex: i,
                    createdAt: sql`CURRENT_TIMESTAMP`,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                });
            }
        }
    });
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

    // Get the menu
    const menu = await db.query.menus.findFirst({
        where: and(eq(menus.id, menuId), eq(menus.locationId, validLocation.id)),
    });

    if (!menu) {
        return null;
    }

    // Get menu items with their sort order
    const menuItemsResult = await db
        .select({
            id: menuItems.id,
            name: menuItems.name,
            description: menuItems.description,
            price: menuItems.price,
            type: menuItems.type,
            isNew: menuItems.isNew,
            locationId: menuItems.locationId,
            createdAt: menuItems.createdAt,
            updatedAt: menuItems.updatedAt,
            sortOrderIndex: menuItemsToMenus.sortOrderIndex,
        })
        .from(menuItems)
        .innerJoin(menuItemsToMenus, eq(menuItems.id, menuItemsToMenus.menuItemId))
        .where(eq(menuItemsToMenus.menuId, menuId))
        .orderBy(asc(menuItemsToMenus.sortOrderIndex));

    // Construct a plain object with only the necessary data
    return {
        id: menu.id,
        name: menu.name,
        locationId: menu.locationId,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
        items: menuItemsResult,
    };
}
