'use server';

import { revalidatePath } from 'next/cache';
import { db } from '~/server/db';
import { menuItemsToMenus, menuItems } from '~/server/db/schema';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { asc } from 'drizzle-orm';

export async function getAvailableMenuItems(locationId: LocationId): Promise<MenuItem[]> {
    const items = await db.query.menuItems.findMany({
        where: (menuItems, { eq }) => eq(menuItems.locationId, locationId),
        orderBy: (menuItems, { desc }) => desc(menuItems.name),
    });

    return items;
}

export async function getMenuItems(menuId: number): Promise<MenuItem[]> {
    const items = await db.query.menuItemsToMenus.findMany({
        where: (menuItemsToMenus, { eq }) => eq(menuItemsToMenus.menuId, menuId),
        orderBy: (menuItemsToMenus, { asc }) => asc(menuItemsToMenus.sortOrderIndex),
        with: {
            menuItem: true,
        },
    });

    return items.map((item) => item.menuItem);
}

export async function getMenuItemById(menuItemId: number): Promise<MenuItem | null> {
    const item = await db.query.menuItems.findFirst({
        where: (menuItems, { eq }) => eq(menuItems.id, menuItemId),
    });

    return item ?? null;
}

export async function addItemToMenu(menuId: number, menuItemId: number) {
    await db.insert(menuItemsToMenus).values({
        menuId,
        menuItemId,
        sortOrderIndex: 0,
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
    });
}

export async function updateMenuItemsSortOrder(menuId: number, menuItemIds: number[]) {
    await db.transaction(async (tx) => {
        // Delete existing sort order
        await tx.delete(menuItemsToMenus).where(eq(menuItemsToMenus.menuId, menuId));

        // Insert new sort order
        const values = menuItemIds.map((menuItemId, index) => ({
            menuId,
            menuItemId,
            sortOrderIndex: index,
            createdAt: sql`CURRENT_TIMESTAMP`,
            updatedAt: sql`CURRENT_TIMESTAMP`,
        }));

        await tx.insert(menuItemsToMenus).values(values);
    });

    revalidatePath('/u/[locationId]/menus');
} 