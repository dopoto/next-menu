import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { LocationDialog } from '~/app/u/[locationId]/location/_components/LocationDialog';
import { EditLocation } from '~/components/EditLocation';
import { LocationDetails } from '~/components/LocationDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
//import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

type Params = Promise<{ locationId: string }>;

export default async function LocationPage(props: { params: Params }) {
    const params = await props.params;
    const validLocationId = getValidLocationIdOrThrow(params.locationId); //TODO validate inside convex fn instead    
    const validLocation = (await fetchQuery(
        api.locations.getLocationForCurrentUserOrThrow, { locationId: validLocationId })) as any //TODO

    if (!validLocation.slug) {
        throw new AppError({
            internalMessage: `Missing slug for location ${validLocationId}`,
        });
    }

    const locationName = validLocation.name ?? '';

    return (
        <LocationDialog locationName={locationName}>
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <LocationDetails id={validLocationId} />
                </TabsContent>
                <TabsContent value="edit" className="p-1 pt-6">
                    <EditLocation location={validLocation} />
                </TabsContent>
            </Tabs>
        </LocationDialog>
    );
}
