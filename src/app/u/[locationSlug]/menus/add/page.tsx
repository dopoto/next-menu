import { Suspense } from 'react';
import { addMenuAction } from '~/app/actions/addMenuAction';
import LoadingSection from '~/app/u/[locationSlug]/_components/LoadingSection';
import { NoQuotaLeft } from '~/app/u/[locationSlug]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationSlug]/menus/_components/AddMenu';
import { UserRouteParamsPromise } from '~/app/u/[locationSlug]/params';
import { CurrencyId } from '~/domain/currencies';
import { MenuItem } from '~/domain/menu-items';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
// import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
// import { getMenuItemsByLocation } from '~/server/queries/menu-items';

export default async function AddMenuPage(props: { params: UserRouteParamsPromise }) {
    const params = await props.params;
    const parsedLocationId = getValidLocationIdOrThrow(params.locationSlug);

    //TODO move inside Suspense below
    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return <NoQuotaLeft featureId="menus" />;
    }

    const allMenuItems = [] as MenuItem[]; // await getMenuItemsByLocation(parsedLocationId);
    const location = { currencyId: 'USD' as CurrencyId }     // await getLocationForCurrentUserOrThrow(parsedLocationId);

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
