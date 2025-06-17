// import { and, eq, sql } from 'drizzle-orm';
// import { type z } from 'zod';
// import { type LocationId } from '~/domain/locations';
// import { type MenuItem, type MenuItemId, type menuItemFormSchema } from '~/domain/menu-items';
// import { AppError } from '~/lib/error-utils.server';
// import { validateAndFormatMenuItemData } from '~/lib/menu-item-utils';
// import { db } from '~/server/db';
// import { menuItems, menuItemsToMenus } from '~/server/db/schema';
// import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

// export async function getMenuItemsByLocation(locationId: LocationId): Promise<MenuItem[]> {
//     const validLocation = await getLocationForCurrentUserOrThrow(locationId);
//     const items = await db.query.menuItems.findMany({
//         where: (menuItems, { eq }) => eq(menuItems.locationId, validLocation.id),
//         orderBy: (menuItems, { desc }) => desc(menuItems.name),
//     });

//     return items;
// }

// export async function getMenuItemById(locationId: LocationId, menuItemId: MenuItemId): Promise<MenuItem | null> {
//     const validLocation = await getLocationForCurrentUserOrThrow(locationId);
//     const item = await db.query.menuItems.findFirst({
//         where: (menuItems, { and, eq }) =>
//             and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)),
//         orderBy: (menuItems, { desc }) => desc(menuItems.name),
//     });

//     return item ?? null;
// }

// export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
//     // Needed - performs security checks and throws on failure.
//     await getLocationForCurrentUserOrThrow(data.locationId);
//     const dbData = validateAndFormatMenuItemData(data);
//     const result = await db.insert(menuItems).values(dbData).returning();
//     return result[0];
// }

// export async function updateMenuItem(menuItemId: MenuItemId, data: z.infer<typeof menuItemFormSchema>) {
//     const validLocation = await getLocationForCurrentUserOrThrow(data.locationId);
//     const dbData = validateAndFormatMenuItemData(data);
//     const result = await db
//         .update(menuItems)
//         .set(dbData)
//         .where(and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)));

//     if (result.rowCount === 0) {
//         const internalMessage = `Menu item with ID ${menuItemId} not found or not authorized for update`;
//         throw new AppError({ internalMessage });
//     }
// }

// export async function deleteMenuItem(locationId: LocationId, menuItemId: MenuItemId) {
//     const validLocation = await getLocationForCurrentUserOrThrow(locationId);
//     const result = await db
//         .delete(menuItems)
//         .where(and(eq(menuItems.locationId, validLocation.id), eq(menuItems.id, menuItemId)));

//     if (result.rowCount === 0) {
//         const internalMessage = `Menu item with ID ${menuItemId} not found or not authorized for deletion`;
//         throw new AppError({ internalMessage });
//     }
// }

// export async function updateMenuItemsSortOrder(menuId: number, menuItemIds: number[]) {
//     await db.transaction(async (tx) => {
//         // Delete existing sort order
//         await tx.delete(menuItemsToMenus).where(eq(menuItemsToMenus.menuId, menuId));

//         // Insert new sort order
//         const values = menuItemIds.map((menuItemId, index) => ({
//             menuId,
//             menuItemId,
//             sortOrderIndex: index,
//             createdAt: sql`CURRENT_TIMESTAMP`,
//             updatedAt: sql`CURRENT_TIMESTAMP`,
//         }));

//         await tx.insert(menuItemsToMenus).values(values);
//     });
// }
