import { ScanQrCode } from "lucide-react";
import { getMenusByLocation } from "~/server/queries";
import MenuCard from "./MenuCard";
import { ROUTES } from "~/app/_domain/routes";
import { EmptyState } from "~/app/u/[locationId]/_components/EmptyState";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";

export async function MenusList(props: { locationId: LocationId }) {
  const items = await getMenusByLocation(props.locationId);

  if (items.length === 0) {
    const href = ROUTES.menusAdd(props.locationId);
    return (
      <EmptyState
        icon={<ScanQrCode size={36} />}
        title={"No menus found"}
        secondary={"This location does not have any menus yet. Add one below."}
        cta={"Add menu"}
        ctaHref={href}
      />
    );
  }

  return (
    <div>
      {items.map((menu) => (
        <MenuCard key={menu.id} item={menu} />
      ))}
    </div>
  );
}
