import { Suspense } from "react";
import LoadingSection from "../../_components/LoadingSection";
import { AddMenuItem } from "~/app/u/[locationId]/menu-items/_components/AddMenuItem";
import { getValidLocationIdOrThrow } from "~/app/_utils/location-utils";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;

  const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

  return (
    <div className="flex h-full flex-col gap-2">
      <Suspense fallback={<LoadingSection />}>
        <AddMenuItem locationId={parsedLocationId} />
      </Suspense>
    </div>
  );
}
