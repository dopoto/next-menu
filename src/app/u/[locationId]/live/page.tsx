import { Suspense } from 'react';
import { LoadingSection } from '~/app/u/[locationId]/_components/LoadingSection';
import { OpenOrders } from '~/app/u/[locationId]/live/_components/OpenOrders';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            <OpenOrders locationId={locationId} />
        </Suspense>
    );
}
