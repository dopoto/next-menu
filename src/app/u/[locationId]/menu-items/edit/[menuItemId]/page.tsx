import { Suspense } from "react";
import LoadingSection from "../../../_components/LoadingSection";
import { getValidLocationIdOrThrow } from "~/app/_utils/location-utils";
import { notFound } from "next/navigation";
import { getMenuItemById } from "~/server/queries/menu-items";
import { EditMenuItem } from "~/app/u/[locationId]/menu-items/_components/EditMenuItem";
import { getValidMenuItemIdOrThrow } from "~/lib/menu-items";

type Params = Promise<{ locationId: string; menuItemId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;

  const parsedLocationId = getValidLocationIdOrThrow(params.locationId);
  const parsedMenuItemId = getValidMenuItemIdOrThrow(params.menuItemId);

  const menuItemToEdit = await getMenuItemById(
    parsedLocationId,
    parsedMenuItemId,
  );

  if (!menuItemToEdit) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <Suspense fallback={<LoadingSection />}>
        <EditMenuItem locationId={parsedLocationId} menuItem={menuItemToEdit} />
      </Suspense>
    </div>
  );
}
