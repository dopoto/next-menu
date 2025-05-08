import { LocationDialog } from '~/app/u/[locationId]/location/_components/LocationDialog';
import { LocationDetails } from '~/components/LocationDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

type Params = Promise<{ locationId: string }>;

export default async function LocationPage(props: { params: Params }) {
    const params = await props.params;
    const validLocationId = getValidLocationIdOrThrow(params.locationId);
    const locationData = await getLocationForCurrentUserOrThrow(validLocationId);

    if (!locationData.slug) {
        throw new AppError({
            internalMessage: `Missing slug for location ${validLocationId}`,
        });
    }

    const locationName = locationData.name ?? '';

    return (
        <LocationDialog locationName={locationName}  >
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <LocationDetails id={validLocationId} />
                </TabsContent>
                <TabsContent value="edit">
                    <>edit</>
                </TabsContent>
     
            </Tabs>
        </LocationDialog>
    );
}
