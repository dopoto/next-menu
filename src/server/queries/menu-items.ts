import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import {
  type MenuItem,
  type menuItemFormSchema,
  type MenuItemId,
  validateAndFormatMenuItemData,
} from "~/lib/menu-items";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { AppError } from "~/lib/error-utils.server";
import { type z } from "zod";
import { menuItems } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import {
  validateLocationOrThrow,
  validateOrganizationOrThrow,
  validateUserOrThrow,
} from "~/app/_utils/security-utils.server-only";

export async function getMenuItemsByLocation(
  locationId: LocationId,
): Promise<MenuItem[]> {
  const userId = await validateUserOrThrow();
  const orgId = await validateOrganizationOrThrow();
  await validateLocationOrThrow(locationId, orgId, userId);

  const items = await db.query.menuItems.findMany({
    where: (menuItems, { eq }) => eq(menuItems.locationId, locationId),
    orderBy: (menuItems, { desc }) => desc(menuItems.name),
  });

  return items;
}

export async function getMenuItemById(
  locationId: LocationId,
  menuItemId: MenuItemId,
): Promise<MenuItem | undefined> {
  const userId = await validateUserOrThrow();
  const orgId = await validateOrganizationOrThrow();
  await validateLocationOrThrow(locationId, orgId, userId);

  const item = await db.query.menuItems.findFirst({
    where: (menuItems, { and, eq }) =>
      and(eq(menuItems.locationId, locationId), eq(menuItems.id, menuItemId)),
    orderBy: (menuItems, { desc }) => desc(menuItems.name),
  });

  return item;
}

export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  const userId = await validateUserOrThrow();
  const orgId = await validateOrganizationOrThrow();
  await validateLocationOrThrow(data.locationId, orgId, userId);

  const dbData = validateAndFormatMenuItemData(data);
  await db.insert(menuItems).values(dbData);
}

export async function updateMenuItem(
  menuItemId: MenuItemId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  const userId = await validateUserOrThrow();
  const orgId = await validateOrganizationOrThrow();
  const locationId = await validateLocationOrThrow(
    data.locationId,
    orgId,
    userId,
  );

  const dbData = validateAndFormatMenuItemData(data);
  const result = await db
    .update(menuItems)
    .set(dbData)
    .where(
      and(eq(menuItems.locationId, locationId), eq(menuItems.id, menuItemId)),
    );

  if (result.rowCount === 0) {
    const internalMessage = `Menu item with ID ${menuItemId} not found or not authorized for update`;
    throw new AppError({ internalMessage });
  }
}
