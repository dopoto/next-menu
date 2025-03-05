import { getMenusByLocation } from "~/server/queries";
import { LocationIdSchema } from "~/app/_domain/location";

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;
  const locationId = params.locationId;

  if (!locationId) {
    return <div className="text-red-500">Error: No location ID provided</div>;
  }

  const locationIdResult = LocationIdSchema.safeParse(locationId);
  if (!locationIdResult.success) {
    return (
      <div className="text-red-500">Error: Invalid location IDd format: {locationId}</div>
    );
  }

  const parsedLocationId = locationIdResult.data;

  const items = await getMenusByLocation(parsedLocationId);
  return (
    <div>
      {items.map((i) => (
        <div key={i.name}>{i.name}</div>
      ))}
    </div>
  );
}
