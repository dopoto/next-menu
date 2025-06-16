import JotaiProviderWrapper from './_components/JotaiProviderWrapper';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { getCompletedOrdersByLocation, getOpenOrdersByLocation } from '~/server/queries/orders';
import { getLocationForCurrentUserOrThrow } from '~/server/queries/locations';
import { AppError } from '~/lib/error-utils.server';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

//TODO
// export const metadata: Metadata = {
//     title: 'Orders - Next Menu',
// };

type Params = Promise<{ locationId: string }>;

export default async function OrdersLayout(props: {
    children: React.ReactNode;
    params: Params;
}) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

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
                {props.children}
            </JotaiProviderWrapper>
        );
    } catch (error) {
        //TODO review
        if (error instanceof AppError) {
            throw error;
        }
    }
}
