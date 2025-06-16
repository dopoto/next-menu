import { ReactNode } from 'react';
import JotaiProviderWrapper from '~/app/u/[locationId]/orders2/_components/JotaiProviderWrapper';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { getOpenOrdersByLocation, getCompletedOrdersByLocation } from '~/server/queries/orders';

export async function DataLoader(props: { locationId: string, children: ReactNode }) {
    const locationId = (await getLocationForCurrentUserOrThrow(props.locationId)).id;

    const [openOrders, completedOrders, menuItems] = await Promise.all([
        getOpenOrdersByLocation(locationId),
        getCompletedOrdersByLocation(locationId),
        getMenuItemsByLocation(locationId),
    ]);

    return (
        <JotaiProviderWrapper
            openOrders={openOrders}
            completedOrders={completedOrders}
            menuItems={menuItems}
        >
            {props.children}
        </JotaiProviderWrapper>
    );
}