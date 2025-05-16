import { type InferSelectModel } from 'drizzle-orm';
import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { LiveOrders } from '~/app/u/[locationId]/live/_components/LiveOrders';
import { type LocationId } from '~/domain/locations';
import { type OrderItemStatus } from '~/domain/order-items';
import { AppError } from '~/lib/error-utils.server';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { db } from '~/server/db';
import { type menuItems, type orderItems, type orders } from '~/server/db/schema';
import { getOpenOrdersByLocation } from '~/server/queries/orders';

type DBOrderItem = InferSelectModel<typeof orderItems> & {
    menuItem: InferSelectModel<typeof menuItems>;
};

type DBOrder = InferSelectModel<typeof orders> & {
    orderItems: DBOrderItem[];
};

export async function OpenOrdersList(props: { locationId: LocationId }) {
    try {
        const openOrders = await getOpenOrdersByLocation(props.locationId);

        if (!openOrders) {
            throw new AppError({
                internalMessage: `Failed to fetch open orders for location ${props.locationId}`,
                publicMessage: 'Failed to load orders. Please try refreshing the page.',
            });
        }

        // Fetch all menu items related to the order items
        const menuItemIds = openOrders.flatMap((order) => order.orderItems.map((item) => item.menuItemId));

        const menuItemsData = (await db.query.menuItems.findMany({
            where: (menuItems, { inArray }) => inArray(menuItems.id, menuItemIds),
            columns: {
                id: true,
                name: true,
                price: true,
            },
        })) as InferSelectModel<typeof menuItems>[];

        // Create a map of menuItemId to menuItem for quick lookup
        const menuItemsMap = new Map<number, InferSelectModel<typeof menuItems>>(
            menuItemsData.map((item) => [item.id, item]),
        );

        const ordersWithItems = openOrders.map((order) => ({
            ...order,
            orderId: order.id.toString(),
            items: order.orderItems.map((item) => {
                const menuItem = menuItemsMap.get(item.menuItemId);
                if (!menuItem) {
                    console.warn(`Menu item with ID ${item.menuItemId} not found for order item ${item.id}`);
                }
                return {
                    menuItem: {
                        id: menuItem?.id ?? item.menuItemId, // Fallback to the menuItemId if not found
                        name: menuItem?.name ?? 'Unknown Item',
                        price: menuItem?.price ?? '0', // Default price if not found
                    },
                    status: item.status as OrderItemStatus,
                };
            }),
        }));

        if (ordersWithItems.length === 0) {
            const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;
            const title = 'No open orders at the moment';
            const secondary = hasAddedMenus
                ? 'Please come back in a while.'
                : 'For orders to flow in, start by adding one or more menus.';
            return (
                <EmptyState
                    icon={<LayoutDashboard size={36} />}
                    title={title}
                    secondary={secondary}
                    cta={hasAddedMenus ? undefined : 'Add menu'}
                    ctaHref={hasAddedMenus ? undefined : ROUTES.menusAdd(props.locationId)}
                />
            );
        }

        return <LiveOrders locationId={props.locationId} initialOrders={ordersWithItems} />;
    } catch (error) {
        console.error('Error in OpenOrdersList:', error);
        throw error instanceof AppError
            ? error
            : new AppError({
                  internalMessage: `Unexpected error in OpenOrdersList: ${error}`,
                  publicMessage: 'Failed to load orders. Please try refreshing the page.',
              });
    }
}
