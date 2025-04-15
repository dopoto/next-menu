import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import {
  MenuItem,
  menuItemFormSchema,
  MenuItemId,
  validateAndFormatMenuItemData,
} from "~/app/_domain/menu-items";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { AppError } from "~/lib/error-utils.server";
import { z } from "zod";
import { menuItems } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import {
  validateLocation,
  validateOrganization,
  validateUser,
} from "~/app/_utils/security-utils.server-only";

export async function getMenuItemsByLocation(
  locationId: LocationId,
): Promise<MenuItem[]> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  // First verify the location belongs to the organization
  const location = await db.query.locations.findFirst({
    where: (locations, { and, eq }) =>
      and(eq(locations.id, locationId), eq(locations.orgId, orgId)),
  });

  if (!location) {
    throw new AppError({
      internalMessage: "Location not found or access denied",
    });
  }

  // Now fetch menus for this location
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
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  // First verify the location belongs to the organization
  const location = await db.query.locations.findFirst({
    where: (locations, { and, eq }) =>
      and(eq(locations.id, locationId), eq(locations.orgId, orgId)),
  });

  if (!location) {
    throw new AppError({
      internalMessage: "Location not found or access denied",
    });
  }

  const item = await db.query.menuItems.findFirst({
    where: (menuItems, { and, eq }) =>
      and(eq(menuItems.locationId, locationId), eq(menuItems.id, menuItemId)),
    orderBy: (menuItems, { desc }) => desc(menuItems.name),
  });

  return item;
}

export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  const userId = await validateUser();
  const orgId = await validateOrganization();
  await validateLocation(data.locationId, orgId, userId);

  //TODO check quota

  const dbData = validateAndFormatMenuItemData(data);
  await db.insert(menuItems).values(dbData);
}

export async function updateMenuItem(
  menuItemId: MenuItemId,
  locationId: LocationId,
  data: z.infer<typeof menuItemFormSchema>,
) {
  await validateUser();

  const dbData = validateAndFormatMenuItemData(data);
  const result = await db
    .update(menuItems)
    .set(dbData)
    .where(
      and(eq(menuItems.locationId, locationId), eq(menuItems.id, menuItemId)),
    );

  if (result.rowCount === 0) {
    throw new AppError({
      internalMessage: `Menu item with ID ${menuItemId} not found or not authorized for update`,
    });
  }
}
