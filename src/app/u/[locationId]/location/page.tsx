import { LocationDetails } from '~/app/_components/LocationDetails';
import { LocationDialog } from '~/app/u/[locationId]/location/_components/LocationDialog';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function LocationPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <LocationDialog>
            <LocationDetails id={locationId} />
        </LocationDialog>
    );
}
