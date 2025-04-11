import * as React from "react";
import { Suspense } from "react";
import LoadingSection from "../../_components/LoadingSection";
import { locationIdSchema } from "../../_domain/locations";
import { AddMenuItem } from "./_components/AddMenuItem";
import { AppError } from "~/lib/error-utils.server";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;

  const locationValidationResult = locationIdSchema.safeParse(
    params.locationId,
  );
  if (!locationValidationResult.success) {
    throw new AppError({
      internalMessage: `Location validation failed. params: ${JSON.stringify(params)}`,
    });
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <Suspense fallback={<LoadingSection />}>
        <AddMenuItem locationId={locationValidationResult.data} />
      </Suspense>
    </div>
  );
}
