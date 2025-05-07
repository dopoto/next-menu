import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { addMenuAction } from '~/app/actions/addMenuAction';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationId]/menus/_components/AddMenu';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
    // TODO refactor - extraxct to fn
    const {  sessionClaims } = await auth();    
    const tierId = sessionClaims?.metadata.tier;
    const parsedTier = getValidPriceTier(tierId);
    if (!parsedTier) {
        throw new AppError({
            internalMessage: `No valid tier found in auth.`,
        });
    }
    
    const params = await props.params;
    const validLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId='menus' currentPriceTierId={parsedTier.id} />;
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
