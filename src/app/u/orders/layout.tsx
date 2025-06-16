import { auth } from '@clerk/nextjs/server';
import { type Metadata } from 'next';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { getMyActiveOrders, getMyCompletedOrders } from '~/server/queries/orders';
import JotaiProviderWrapper from './_components/JotaiProviderWrapper';

export const metadata: Metadata = {
    title: 'Orders - Next Menu',
};

async function OrdersContent({ children }: { children: React.ReactNode }) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new Error('Not authenticated or no organization');
    }

    // TODO: Get location from user preferences or based on organization
    const locationId = 1;

    // Fetch all necessary data
    const menuItems = await getMenuItemsByLocation(locationId);
    const [openOrders, completedOrders] = await Promise.all([
        getMyActiveOrders(userId),
        getMyCompletedOrders(userId),
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
}

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OrdersContent>
            {children}
        </OrdersContent>
    );
}
