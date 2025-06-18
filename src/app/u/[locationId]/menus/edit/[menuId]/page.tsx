import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { EditMenu } from '~/app/u/[locationId]/menus/_components/EditMenu';
import { CurrencyId } from '~/domain/currencies';
import { MenuItem } from '~/domain/menu-items';
import { Menu } from '~/domain/menus';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getValidMenuIdOrThrow } from '~/lib/menu-utils';
// import { getMenuItemsByLocation } from '~/server/queries/menu-items';
// import { getMenuById } from '~/server/queries/menus';

type Params = Promise<{ locationId: string; menuId: string }>;

export default async function EditMenuPage(props: { params: Params }) {
    const params = await props.params;
    const validLocationId = getValidLocationIdOrThrow(params.locationId);
    const validMenuId = getValidMenuIdOrThrow(params.menuId);

    const menu = {} as Menu; //TODO = await getMenuById(validLocationId, validMenuId);
    if (!menu) {
        return notFound();
    }

    const allMenuItems = [] as MenuItem[]; //TODO await getMenuItemsByLocation(validLocationId);
    const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId: validLocationId })

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <EditMenu
                    locationId={validLocationId}
                    // TODO revisit
                    currencyId={validLocation.currencyId as CurrencyId}
                    menu={menu}
                    allMenuItems={allMenuItems}
                />
            </Suspense>
        </div>
    );
}
