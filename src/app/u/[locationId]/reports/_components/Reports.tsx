import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { LocationViewsCard } from "~/app/u/[locationId]/reports/_components/LocationViewsCard";

export async function Reports(props: { locationId: LocationId }) {
  return (
    <div>
      <LocationViewsCard locationId={props.locationId} />
    </div>
  );
}
