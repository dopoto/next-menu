import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenuItem } from '~/app/u/[locationId]/menu-items/_components/AddMenuItem';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
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

    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menuItems');

    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId='menuItems' currentPriceTierId={parsedTier.id} />;
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <AddMenuItem locationId={parsedLocationId} />
            </Suspense>
        </div>
    );
}
