 
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { LocationId } from "~/domain/locations";
import { menuFormSchema, MenuId } from "~/domain/menus";
import { AppError } from "~/lib/error-utils.server";
import { validateAndFormatMenuData } from "~/lib/menu-utils";
import { db } from "~/server/db";
import { menus } from "~/server/db/schema";
import { getLocation } from "~/server/queries/location";

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
    const result = await db
        .delete(menus)
        .where(and(eq(menus.locationId, validLocation.id), eq(menus.id, menuId)));

    if (result.rowCount === 0) {
        const internalMessage = `Menu with ID ${menuId} not found or not authorized for deletion`;
        throw new AppError({ internalMessage });
    }
}
