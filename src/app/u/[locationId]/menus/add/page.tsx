import { Suspense } from 'react';
import { addMenuAction } from '~/app/actions/addMenuAction';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationId]/menus/_components/AddMenu';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
    const params = await props.params;
    const validLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId='menus' />;
    }

    const allMenuItems = await getMenuItemsByLocation(validLocationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <AddMenu locationId={validLocationId} addMenuAction={addMenuAction} allMenuItems={allMenuItems} />
            </Suspense>
        </div>
    );
}
