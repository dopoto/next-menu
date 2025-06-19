import { auth } from '@clerk/nextjs/server';
import { api } from '../../../../../convex/_generated/api'
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { LocationViewsCard } from '~/app/u/[locationSlug]/reports/_components/LocationViewsCard';
import { AppError } from '~/lib/error-utils.server';
import { isFlagAvailableInCurrentTier } from '~/lib/quota-utils.server-only';
import { LocationId } from '~/domain/locations';
import { UserRouteParamsPromise } from '~/app/u/[locationSlug]/params';

export default async function ReportsPage(props: { params: UserRouteParamsPromise }) {
    const params = await props.params;

    // TODO const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId: params.locationId })
    const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId: 1 })


    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No userId or orgId found in auth.`,
        });
    }

    const areReportsAvailable = await isFlagAvailableInCurrentTier('reports');
    const mode = areReportsAvailable ? 'regular' : 'locked';

    //TODO 

    return (
        <div>
            <Suspense
                fallback={<LocationViewsCard mode="placeholder" locationId={'1' as LocationId} organizationId={0} locationSlug={''} />}
            >
                {/* TODO <LocationViewsCard
                    mode={mode}
                    locationId={validLocation._id}
                    organizationId={validLocation.orgId}
                    locationSlug={validLocation.slug}
                /> */}
            </Suspense>
        </div>
    );
}
