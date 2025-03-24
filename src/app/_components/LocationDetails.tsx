import React from "react";
import { Labeled } from "./Labeled";
import { auth } from "@clerk/nextjs/server";
import { getLocation } from "~/server/queries";
import {
  LocationId,
  locationIdSchema,
} from "~/app/u/[locationId]/_domain/locations";

export async function LocationDetails(props: { id: LocationId }) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No orgId found in auth.`);
  }

  const validationResult = locationIdSchema.safeParse(props.id);
  if (!validationResult.success) {
    // TODO Test
    throw new Error("Location issue");
  }

  const locationData = await getLocation(validationResult.data);
  console.log(JSON.stringify(locationData));

  return (
    <div>
      <Labeled label={"Slug"} text={locationData.slug} />
    </div>
  );
}
