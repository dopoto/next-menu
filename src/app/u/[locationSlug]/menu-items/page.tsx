import { Suspense } from 'react';
import { FormTitle } from '~/app/u/[locationSlug]/_components/FormTitle';
import LoadingSection from '~/app/u/[locationSlug]/_components/LoadingSection';
import { MenusItemsList } from '~/app/u/[locationSlug]/menu-items/_components/MenuItemsList';
import { UserRouteParamsPromise } from '~/app/u/[locationSlug]/params';
import { CurrencyId } from '~/domain/currencies';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
//import { getLocationPublicDataById } from '~/server/queries/locations';

export default async function MenuItemsPage(props: { params: UserRouteParamsPromise }) {
    const params = await props.params;
    const parsedlocationId = getValidLocationIdOrThrow(params.locationId);
    //const location = await getLocationPublicDataById(parsedlocationId);
    const location = { currencyId: 'USD' as CurrencyId } // TODO await getLocationForCurrentUserOrThrow(parsedLocationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <FormTitle
                title="Menu items"
                subtitle="Your catalog of dishes and beverages. Each item can be used in one or more menus."
            />
            <Suspense fallback={<LoadingSection />}>
                <MenusItemsList locationId={parsedlocationId} currencyId={location.currencyId} />
            </Suspense>
        </div>
    );
}
