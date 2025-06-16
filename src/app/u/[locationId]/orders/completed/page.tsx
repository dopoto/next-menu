import { Suspense } from 'react';
import { LoadingSection } from '~/app/u/[locationId]/_components/LoadingSection';
import { CompletedOrdersList2 } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrdersList2';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function CompletedPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            <CompletedOrdersList2 locationId={locationId} />
        </Suspense>
    );
}
