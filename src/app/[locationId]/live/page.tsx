import { Suspense } from "react"; 
import { EmptyState } from "../_components/EmptyState";
import { getUsedQuota } from "~/app/_utils/quota-utils";
import { LayoutDashboard } from "lucide-react";
import { locationIdSchema } from "../_domain/locations";

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

  //TODO: Implement OpenOrders page
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Open orders</div>
    </Suspense>
  );
}
