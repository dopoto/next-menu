import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { OpenOrdersList } from '~/app/u/[locationId]/live/_components/OpenOrdersList';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function CompletedPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            {/* <OpenOrdersList locationId={locationId} />*/}
            TODO
        </Suspense>
    );
}
