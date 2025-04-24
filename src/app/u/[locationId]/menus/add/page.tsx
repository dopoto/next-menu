import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationId]/menus/_components/AddMenu';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
    const params = await props.params;

    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menus');

    if (availableQuota <= 0) {
        return <NoQuotaLeft title={'You have used all menus available in your current plan'} />;
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <AddMenu locationId={parsedLocationId}   />
            </Suspense>
        </div>
    );
}
