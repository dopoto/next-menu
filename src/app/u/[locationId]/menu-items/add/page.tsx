import { api } from 'convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenuItem } from '~/app/u/[locationId]/menu-items/_components/AddMenuItem';
import { CurrencyId } from '~/domain/currencies';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
//import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
    const params = await props.params;
    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menuItems');
    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId="menuItems" />;
    }

    //const location = await getLocationForCurrentUserOrThrow(parsedLocationId);
    const location = await fetchQuery(
        api.locations.getLocationForCurrentUserOrThrow, { locationId: parsedLocationId })

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                {/* TODO as CurrencyId */}
                <AddMenuItem locationId={parsedLocationId} currencyId={location.currencyId as CurrencyId} />
            </Suspense>
        </div>
    );
}
