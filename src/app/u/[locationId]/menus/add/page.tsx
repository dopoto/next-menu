import type { InferSelectModel } from 'drizzle-orm';
import { Suspense } from 'react';
import { addMenuAction } from '~/app/actions/addMenuAction';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationId]/menus/_components/AddMenu';
import { CurrencyId } from '~/domain/currencies';
import { MenuItem } from '~/domain/menu-items';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import type { locations } from '~/server/db/schema';
// import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
// import { getMenuItemsByLocation } from '~/server/queries/menu-items';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
    const params = await props.params;
    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);

    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId="menus" />;
    }

    const allMenuItems = [] as MenuItem[]; // await getMenuItemsByLocation(parsedLocationId);
    const location = { currencyId: 'USD' as CurrencyId } as InferSelectModel<typeof locations>   // await getLocationForCurrentUserOrThrow(parsedLocationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <AddMenu
                    locationId={parsedLocationId}
                    // TODO
                    currencyId={'USD' as CurrencyId}
                    addMenuAction={addMenuAction}
                    allMenuItems={allMenuItems}
                    location={location}
                />
            </Suspense>
        </div>
    );
}
