import { Suspense } from "react";
import { locationIdSchema } from "../_domain/locations";
import { auth } from "@clerk/nextjs/server";
import { LocationViewsCard } from "~/app/u/[locationId]/reports/_components/LocationViewsCard";
import { isFlagAvailableInCurrentTier } from "~/app/_utils/quota-utils.server-only";
import * as React from "react";
import { AppError } from "~/lib/error-utils.server";

type Params = Promise<{ locationId: string }>;

export default async function ReportsPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new AppError({
      internalMessage: `Location validation failed. params: ${JSON.stringify(params)}`,
    });
  }
  const parsedLocationId = validationResult.data;

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new AppError({
      internalMessage: `No userId or orgId found in auth.`,
    });
  }

  const areReportsAvailable = await isFlagAvailableInCurrentTier("reports");
  const mode = areReportsAvailable ? "regular" : "locked";

  return (
    <div>
      <Suspense
        fallback={
          <LocationViewsCard mode="placeholder" locationId={parsedLocationId} />
        }
      >
        <LocationViewsCard mode={mode} locationId={parsedLocationId} />
      </Suspense>
    </div>
  );
}
