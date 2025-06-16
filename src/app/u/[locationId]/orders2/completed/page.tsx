
import { CompletedOrdersList } from "~/app/u/[locationId]/orders2/_components/CompletedOrdersList";
import { getLocationForCurrentUserOrThrow } from "~/server/queries/locations";

type Params = Promise<{ locationId: string }>;

export default async function Page(props: {

    params: Params;
}) {

    const params = await props.params;
    const locationId = (await getLocationForCurrentUserOrThrow(params.locationId)).id;

    return <CompletedOrdersList locationId={locationId} />
}