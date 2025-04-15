import { Suspense } from "react";
import LoadingSection from "../../_components/LoadingSection";
import { AddMenuItem } from "~/app/u/[locationId]/menu-items/_components/AddMenuItem";
import { getValidLocationIdOrThrow } from "~/app/_utils/location-utils";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";
import { NoQuotaLeft } from "~/app/u/[locationId]/_components/NoQuotaLeft";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;

  const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

  const availableQuota = await getAvailableFeatureQuota("menuItems");
  console.log(availableQuota);

  if (availableQuota <= 0) {
    return (
      <NoQuotaLeft title={"No more menu items in your current quota..."} />
    );
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <Suspense fallback={<LoadingSection />}>
        <AddMenuItem locationId={parsedLocationId} />
      </Suspense>
    </div>
  );
}
