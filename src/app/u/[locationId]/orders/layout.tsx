import JotaiProviderWrapper from './_components/JotaiProviderWrapper';
import { redirect } from 'next/navigation';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { getCompletedOrdersByLocation, getOpenOrdersByLocation } from '~/server/queries/orders';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { AppError } from '~/lib/error-utils.server';
import type { LocationId } from '~/domain/locations';

//TODO
// export const metadata: Metadata = {
//     title: 'Orders - Next Menu',
// };

export default async function OrdersLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locationId: string };
}) {
    const locationId = Number(params.locationId) as LocationId;

    try {
        await getLocationForCurrentUserOrThrow(locationId);

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
                {children}
            </JotaiProviderWrapper>
        );
    } catch (error) {
        //TODO review
        if (error instanceof AppError) {
            throw error;
        }
    }
}
