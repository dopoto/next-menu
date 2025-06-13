import { Suspense } from 'react';
import { LoadingSection } from '~/app/u/[locationId]/_components/LoadingSection';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function DashboardPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            {/* <OpenOrdersList locationId={locationId} />*/}
            TODO
        </Suspense>
    );
}
