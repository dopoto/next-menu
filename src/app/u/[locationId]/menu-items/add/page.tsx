import { Suspense } from 'react';
import { getAvailableFeatureQuota } from '~/app/_utils/quota-utils.server-only';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenuItem } from '~/app/u/[locationId]/menu-items/_components/AddMenuItem';
import { getValidLocationIdOrThrow } from '~/lib/location';
import LoadingSection from '../../_components/LoadingSection';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
    const params = await props.params;

    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menuItems');
    console.log(availableQuota);

    if (availableQuota <= 0) {
        return <NoQuotaLeft title={'You have used all menu items available in your current plan'} />;
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <AddMenuItem locationId={parsedLocationId} />
            </Suspense>
        </div>
    );
}
