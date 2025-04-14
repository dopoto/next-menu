import "server-only";
import { auth } from "@clerk/nextjs/server";
import { AppError } from "~/lib/error-utils.server";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";

/**
 * Checks if the user is authenticated and returns the user ID.
 * Throws an error if the user is not authenticated.
 * @returns The user ID of the authenticated user.
 */
export async function validateUser(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new AppError({ internalMessage: "Unauthorized" });
  }
  return userId;
}

/**
 * Checks if the claims contain an Org Id and returns the Org Id.
 * Throws an error if the  Org Id is missing.
 * @returns The Org Id.
 */
export async function validateOrganization(): Promise<string> {
  const { sessionClaims } = await auth();
  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }
  return orgId;
}

/**
 * Checks if the the location belongs to the organization the user is in.
 * Throws an error if that's not the case.
 * @returns The valid Location Id.
 */
export async function validateLocation(
  locationId: LocationId,
  organizationId: string,
  userId: string,
): Promise<LocationId> {
  const { sessionClaims } = await auth();
  const orgId = sessionClaims?.org_id;
  if (!orgId) {
    throw new AppError({ internalMessage: "No organization ID found" });
  }
  return orgId;
}
