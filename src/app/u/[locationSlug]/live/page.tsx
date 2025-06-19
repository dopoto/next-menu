import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationSlug]/_components/LoadingSection';
import { OpenOrdersList } from '~/app/u/[locationSlug]/live/_components/OpenOrdersList';
import { UserRouteParamsPromise } from '~/app/u/[locationSlug]/params';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

export default async function OpenOrdersPage(props: { params: UserRouteParamsPromise }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <Suspense fallback={<LoadingSection />}>
            <OpenOrdersList locationId={locationId} />
        </Suspense>
    );
}
