import { locationIdSchema } from "~/app/_domain/location";
import { BoxError } from "~/app/_components/BoxError";
import { EmptyState } from "../_components/EmptyState";

type Params = Promise<{ locationId: string }>;

export default async function OrdersPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    return <BoxError errorTypeId={"ORDERS_INVALID_PARAM"} />;
  }

 // const parsedLocationId = validationResult.data;
  const items = await Promise.resolve([]);

  if (items.length === 0) {
    return (
      <EmptyState
        title={"No open orders found at this time"}
        secondary={"For orders to flow in, start by adding one or more menus."}
        cta={"Add menu"}
        ctaHref={"menus/add"}
      />
    );
  }

  return (
    <div>
      ...
    </div>
  );
}
