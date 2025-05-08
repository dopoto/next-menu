import { auth } from '@clerk/nextjs/server';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { type z } from 'zod';
import { type LocationId } from '~/domain/locations';
import { type MenuItemId, type MenuItemWithSortOrder } from '~/domain/menu-items';
import { type Menu, type menuFormSchema, type MenuId, type MenuWithItems } from '~/domain/menus';
import { getValidClerkOrgIdOrThrow } from '~/lib/clerk-utils';
import { AppError } from '~/lib/error-utils.server';
import { db } from '~/server/db';
import { locations, menuItems, menuItemsToMenus, menus, organizations } from '~/server/db/schema';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

export async function createMenu(data: z.infer<typeof menuFormSchema>) {
    // Needed - performs security checks and throws on failure.
    await getLocationForCurrentUserOrThrow(data.locationId);

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
                    menuItemId: item?.id ?? 0,
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
    const validLocation = await getLocationForCurrentUserOrThrow(data.locationId);

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
            await tx.delete(menuItemsToMenus).where(eq(menuItemsToMenus.menuId, menuId));

            // Add new menu item associations with proper sort order
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                await tx.insert(menuItemsToMenus).values({
                    menuId: menuId,
                    menuItemId: item?.id ?? 0,
                    sortOrderIndex: i,
                    createdAt: sql`CURRENT_TIMESTAMP`,
                    updatedAt: sql`CURRENT_TIMESTAMP`,
                });
            }
        }
    });
}

export async function deleteMenu(locationId: LocationId, menuId: MenuId) {
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

    await db.transaction(async (tx) => {
        await tx.delete(menuItemsToMenus).where(eq(menuItemsToMenus.menuId, menuId));

        const result = await tx.delete(menus).where(and(eq(menus.locationId, validLocation.id), eq(menus.id, menuId)));

        if (result.rowCount === 0) {
            const internalMessage = `Menu with ID ${menuId} not found or not authorized for deletion`;
            throw new AppError({ internalMessage });
        }
    });
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
    const validLocation = await getLocationForCurrentUserOrThrow(locationId);

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
            isPublished: menuItems.isPublished,             
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
        isPublished: menu.isPublished,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
        items: menuItemsResult,
    };
}

export async function getMenusByLocation(locationId: LocationId): Promise<Menu[]> {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: 'Unauthorized' });
    }

    const validLocation = await getLocationForCurrentUserOrThrow(locationId);
    const validClerkOrgId = getValidClerkOrgIdOrThrow(sessionClaims?.org_id);

    const menus = await db.query.menus.findMany({
        where: (menus, { eq, and }) =>
            and(
                eq(menus.locationId, validLocation.id),
                eq(
                    db
                        .select({ locationId: locations.id })
                        .from(locations)
                        .where(
                            and(
                                eq(locations.id, validLocation.id),
                                eq(
                                    locations.orgId,
                                    db
                                        .select({ id: organizations.id })
                                        .from(organizations)
                                        .where(eq(organizations.clerkOrgId, validClerkOrgId))
                                        .limit(1),
                                ),
                            ),
                        )
                        .limit(1),
                    menus.locationId,
                ),
            ),
        orderBy: (menus, { desc }) => desc(menus.name),
    });

    return menus;
}

export async function getPublicMenusByLocation(locationId: LocationId): Promise<MenuWithItems[]> {
    // TODO soft Validate locationid by schema

    const result = await db
        .select({
            menu: {
                id: menus.id,
                name: menus.name,
                locationId: menus.locationId,
                isPublished: menus.isPublished,
                createdAt: menus.createdAt,
                updatedAt: menus.updatedAt,
            },
            item: {
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
            },
        })
        .from(menus)
        .leftJoin(menuItemsToMenus, eq(menus.id, menuItemsToMenus.menuId))
        .leftJoin(menuItems, eq(menuItemsToMenus.menuItemId, menuItems.id))
        .where(eq(menus.locationId, locationId))
        .orderBy(desc(menus.name), asc(menuItemsToMenus.sortOrderIndex));

    // Group items by menu
    const menuMap = new Map<number, MenuWithItems>();

    for (const row of result) {
        if (!menuMap.has(row.menu.id)) {
            menuMap.set(row.menu.id, {
                ...row.menu,
                items: [],
            });
        }

        const item = row.item;

        // Only add non-null items
        if (item.id && item.name && item.price && item.type) {
            menuMap.get(row.menu.id)?.items.push({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                type: item.type,
                isNew: item.isNew ?? false,
                locationId: item.locationId ?? row.menu.locationId,
                createdAt: item.createdAt ?? new Date(),
                updatedAt: item.updatedAt,
                sortOrderIndex: item.sortOrderIndex ?? 0,
            } as MenuItemWithSortOrder);
        }
    }

    return Array.from(menuMap.values());
}
