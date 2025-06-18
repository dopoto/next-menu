import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { EditMenuItem } from '~/app/u/[locationId]/menu-items/_components/EditMenuItem';
import { CurrencyId } from '~/domain/currencies';
import { MenuItem } from '~/domain/menu-items';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getValidMenuItemIdOrThrow } from '~/lib/menu-item-utils';
// import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
// import { getMenuItemById } from '~/server/queries/menu-items';

type Params = Promise<{ locationId: string; menuItemId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
    const params = await props.params;

    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);
    const parsedMenuItemId = getValidMenuItemIdOrThrow(params.menuItemId);

    const menuItemToEdit = {} as MenuItem  // TODO await getMenuItemById(parsedLocationId, parsedMenuItemId);
    const location = { currencyId: 'USD' as CurrencyId } // TODO await getLocationForCurrentUserOrThrow(parsedLocationId);

    if (!menuItemToEdit) {
        return notFound();
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <EditMenuItem
                    locationId={parsedLocationId}
                    menuItem={menuItemToEdit}
                    currencyId={location.currencyId}
                />
            </Suspense>
        </div>
    );
}
