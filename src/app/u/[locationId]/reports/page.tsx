import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { isFlagAvailableInCurrentTier } from '~/app/_utils/quota-utils.server-only';
import { LocationViewsCard } from '~/app/u/[locationId]/reports/_components/LocationViewsCard';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location';

type Params = Promise<{ locationId: string }>;

export default async function ReportsPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

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
            <Suspense fallback={<LocationViewsCard mode="placeholder" locationId={locationId} />}>
                <LocationViewsCard mode={mode} locationId={locationId} />
            </Suspense>
        </div>
    );
}
