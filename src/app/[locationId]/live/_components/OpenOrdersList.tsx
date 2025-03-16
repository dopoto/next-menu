import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "~/app/[locationId]/_components/EmptyState";
import { type LocationId } from "~/app/[locationId]/_domain/locations";
import { getUsedQuota } from "~/app/_utils/quota-utils";

export async function OpenOrdersList(_props: { locationId: LocationId }) {
  //TODO: Fetch actual open orders  
  const items = await Promise.resolve([]);
 

  if (items.length === 0) {
    const hasAddedMenus = (await getUsedQuota("menus")) > 0;
    const title = "No open orders at the moment";
    const secondary = hasAddedMenus
      ? "Come back in a while."
      : "For orders to flow in, start by adding one or more menus.";
    return (
      <EmptyState
        icon={<LayoutDashboard size={36} />}
        title={title}
        secondary={secondary}
        cta={hasAddedMenus ? undefined : "Add menu"}
        ctaHref={hasAddedMenus ? undefined : "manage/menus/add"}
      />
    );
  }

  return <div>Open orders</div>;
}
