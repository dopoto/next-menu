import { Suspense } from 'react';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import LoadingSection from '../_components/LoadingSection';
import { OpenOrdersList } from './_components/OpenOrdersList';

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            <OpenOrdersList locationId={locationId} />
        </Suspense>
    );
}
