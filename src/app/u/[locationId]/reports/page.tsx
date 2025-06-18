import { auth } from '@clerk/nextjs/server';
import { api } from 'convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { LocationViewsCard } from '~/app/u/[locationId]/reports/_components/LocationViewsCard';
import { AppError } from '~/lib/error-utils.server';
import { isFlagAvailableInCurrentTier } from '~/lib/quota-utils.server-only';

type Params = Promise<{ locationId: string }>;

export default async function ReportsPage(props: { params: Params }) {
    const params = await props.params;

    const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId: params.locationId })


    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No userId or orgId found in auth.`,
        });
    }

    const areReportsAvailable = await isFlagAvailableInCurrentTier('reports');
    const mode = areReportsAvailable ? 'regular' : 'locked';

    return (
        <div>
            <Suspense
                fallback={<LocationViewsCard mode="placeholder" locationId={0} organizationId={0} locationSlug={''} />}
            >
                <LocationViewsCard
                    mode={mode}
                    locationId={validLocation._id}
                    organizationId={validLocation.orgId}
                    locationSlug={validLocation.slug}
                />
            </Suspense>
        </div>
    );
}
