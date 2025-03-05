import { getMenusByLocation } from "~/server/queries";
import { locationIdSchema } from "~/app/_domain/location";
import { BoxError } from "~/app/_components/BoxError";
import { EmptyState } from "../../_components/EmptyState";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    return <BoxError errorTypeId={"MENUS_INVALID_PARAM"} />;
  }

  const parsedLocationId = validationResult.data;
  const items = await getMenusByLocation(parsedLocationId);

  if (items.length === 0) {
    return (
      <EmptyState
        title={"No menus found"}
        secondary={"This location does not have any menus yet. Add one below."}
        cta={"Add menu"}
        ctaHref={"menus/add"}
      />
    );
  }

  return (
    <div>
      {items.map((i) => (
        <div key={i.name}>{i.name}</div>
      ))}
    </div>
  );
}
