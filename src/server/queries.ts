import { auth } from "@clerk/nextjs/server";
import "server-only";
import { db } from "~/server/db";
import { customers, locations } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { AppError } from "~/lib/error-utils.server";

export async function addCustomer(
  clerkUserId: string,
  orgId: string,
  stripeCustomerId?: string,
) {
  // TODO Checks ? auth etc
  const [insertedCustomer] = await db
    .insert(customers)
    .values({
      clerkUserId: clerkUserId,
      orgId: orgId,
      stripeCustomerId: stripeCustomerId,
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
  if (!item) {
    throw new AppError({ internalMessage: `Not found: ${orgId}` });
  }

  return item;
}

export async function getMenusPlanUsage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  const result = await db.query.menus.findMany({
    where: (menus, { eq, and, exists }) =>
      exists(
        db
          .select()
          .from(locations)
          .where(
            and(eq(locations.id, menus.locationId), eq(locations.orgId, orgId)),
          ),
      ),
  });

  return result.length;
}

export async function getMenuItemsPlanUsage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  const result = await db.query.menuItems.findMany({
    where: (menuItems, { eq, and, exists }) =>
      exists(
        db
          .select()
          .from(locations)
          .where(
            and(
              eq(locations.id, menuItems.locationId),
              eq(locations.orgId, orgId),
            ),
          ),
      ),
  });

  return result.length;
}

export async function getLocationsPlanUsage() {
  //TODO
  return Promise.resolve(1);
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

export async function getLocation(id: LocationId) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }

  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }

  const item = await db.query.locations.findFirst({
    where: (model, { eq }) => and(eq(model.id, id), eq(model.orgId, orgId)),
  });

  if (!item) {
    throw new AppError({ internalMessage: `Not found: ${id}` });
  }

  return item;
}
