import { auth } from "@clerk/nextjs/server";
import "server-only";
import { type LocationId } from "~/app/_domain/location";
import { db } from "~/server/db";
import { customers, locations, type Menu } from "./db/schema";
import { eq } from "drizzle-orm";

export async function addCustomer(clerkUserId: string, orgId: string) {
  // TODO Checks ? auth etc
  const [insertedCustomer] = await db
    .insert(customers)
    .values({
      clerkUserId: clerkUserId,
      orgId: orgId,
    })
    .returning({ id: customers.id });
  return insertedCustomer;
}

export async function updateCustomerByClerkUserId(
  clerkUserId: string,
  stripeCustomerId: string | null,
) {
  // TODO Checks

  const [updatedCustomer] = await db
    .update(customers)
    .set({
      stripeCustomerId,
    })
    .where(eq(customers.clerkUserId, clerkUserId))
    .returning({ id: customers.id });
  return updatedCustomer;
}

export async function getCustomerByOrgId(orgId: string) {
  // TODO Checks
  const item = await db.query.customers.findFirst({
    where: (model, { eq }) => eq(model.orgId, orgId),
  });
  if (!item) throw new Error("Not found");
  return item;
}

export async function addLocation(orgId: string, name: string) {
  const [insertedLocation] = await db
    .insert(locations)
    .values({
      name: name,
      orgId: orgId,
    })
    .returning({ id: locations.id });
  return insertedLocation;
}

export async function getLocation(id: number) {
  const item = await db.query.locations.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!item) throw new Error("Not found");

  return item;
}

export async function getLocations() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });
  return items;
}

export async function getMenusByLocation(
  locationId: LocationId,
): Promise<Menu[]> {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const orgId = sessionClaims?.org_id;
  if (!orgId) throw new Error("No organization ID found");

  // First verify the location belongs to the organization
  const location = await db.query.locations.findFirst({
    where: (locations, { and, eq }) =>
      and(eq(locations.id, locationId), eq(locations.orgId, orgId)),
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
