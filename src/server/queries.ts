import { auth } from "@clerk/nextjs/server";
import "server-only";
import { type LocationId } from "~/app/_domain/location";
import { db } from "~/server/db";
import { Menu } from "./db/schema";

export async function getLocations() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });
  return items;
}

export async function getMenusByLocation(locationId: LocationId): Promise<Menu[]> {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const orgId = sessionClaims?.org_id;
  if (!orgId) throw new Error("No organization ID found");

  // First verify the location belongs to the organization
  const location = await db.query.locations.findFirst({
    where: (locations, { and, eq }) => 
      and(
        eq(locations.id, locationId),
        eq(locations.orgId, orgId)
      )
  });

  if (!location) {
    throw new Error("Location not found or access denied");
  }

  // Now fetch menus for this location
  const items = await db.query.menus.findMany({
    where: (menus, { eq }) => eq(menus.locationId, locationId),
    orderBy: (menus, { desc }) => desc(menus.name),
  });

  return items;
}

export async function getLocation(id: number) {
  const item = await db.query.locations.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!item) throw new Error("Not found");

  return item;
}
