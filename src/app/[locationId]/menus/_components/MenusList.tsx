import { ScanQrCode } from "lucide-react";
import { EmptyState } from "~/app/[locationId]/_components/EmptyState";
import { type LocationId } from "~/app/[locationId]/_domain/locations";
import { getMenusByLocation } from "~/server/queries";
import MenuCard from "./MenuCard";
import { ROUTES } from "~/app/_domain/routes";

export async function MenusList(props: { locationId: LocationId }) {
  const items = await getMenusByLocation(props.locationId);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ScanQrCode size={36} />}
        title={"No menus found"}
        secondary={"This location does not have any menus yet. Add one below."}
        cta={"Add menu"}
        ctaHref={ROUTES.menusAdd}
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
