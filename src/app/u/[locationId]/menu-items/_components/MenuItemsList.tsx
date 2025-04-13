import { CirclePlusIcon, UtensilsCrossedIcon } from "lucide-react";
import { ROUTES } from "~/app/_domain/routes";
import { EmptyState } from "~/app/u/[locationId]/_components/EmptyState";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import MenuItemCard from "./MenuItemCard";
import Link from "next/link";
import { getMenuItemsByLocation } from "~/server/queries/menu-items";

export async function MenusItemsList(props: { locationId: LocationId }) {
  const items = await getMenuItemsByLocation(props.locationId);
  return (
    <div className="flex h-full flex-col gap-3">
      <Link
        className="flex w-full flex-row items-center-safe justify-center-safe gap-2 rounded-sm border-1 border-dashed p-4 font-bold"
        href={ROUTES.menuItemsAdd(props.locationId)}
      >
        <CirclePlusIcon /> <span>Add dish or drink...</span>
      </Link>

      {items.length === 0 && (
        <EmptyState
          icon={<UtensilsCrossedIcon size={36} />}
          title={"No dishes or drinks found"}
          secondary={""}
        />
      )}
      {items.map((menuItem) => (
        <MenuItemCard
          key={menuItem.id}
          locationId={props.locationId}
          item={menuItem}
        />
      ))}
    </div>
  );
}
