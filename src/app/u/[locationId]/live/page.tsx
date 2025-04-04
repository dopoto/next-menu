import { Suspense } from "react";
import { locationIdSchema } from "../_domain/locations";
import LoadingSection from "../_components/LoadingSection";
import { OpenOrdersList } from "./_components/OpenOrdersList";
import * as React from "react";
import { AppError } from "~/lib/error-utils.server";

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
  const params = await props.params;

  const locationValidationResult = locationIdSchema.safeParse(
    params.locationId,
  );
  if (!locationValidationResult.success) {
    throw new AppError({
      internalMessage: `Invalid location: ${params.locationId}`,
    });
  }

  return (
    <Suspense fallback={<LoadingSection />}>
      <OpenOrdersList locationId={locationValidationResult.data} />
    </Suspense>
  );
}
