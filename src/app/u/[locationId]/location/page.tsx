import { LocationDetails } from "~/app/_components/LocationDetails";
import { locationIdSchema } from "~/app/u/[locationId]/_domain/locations";
import LocationDialog from "~/app/u/[locationId]/location/_components/LocationDialog";

type Params = Promise<{ locationId: string }>;

export default async function LocationPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO Test
    throw new Error("Location issue");
  }

  return (
    <LocationDialog>
      <LocationDetails id={validationResult.data} />
    </LocationDialog>
  );
}
