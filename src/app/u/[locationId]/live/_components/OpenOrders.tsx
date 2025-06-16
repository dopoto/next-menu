import { type InferSelectModel } from 'drizzle-orm';
import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { OpenOrdersList } from '~/app/u/[locationId]/live/_components/OpenOrdersList';
import { type LocationId } from '~/domain/locations';
import type { MenuItemId, MenuItem } from '~/domain/menu-items';
import { AppError } from '~/lib/error-utils.server';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { getOpenOrdersByLocation } from '~/server/queries/orders';

export async function OpenOrders(props: { locationId: LocationId }) {
    try {
        const openOrders = await getOpenOrdersByLocation(props.locationId);
        if (!openOrders) {
            throw new AppError({
                internalMessage: `Failed to fetch open orders for location ${props.locationId}`,
                publicMessage: 'Failed to load orders. Please try refreshing the page.',
            });
        }

        const menuItems = await getMenuItemsByLocation(props.locationId);
        const menuItemsMap = new Map<MenuItemId, MenuItem>(
            menuItems.map((item) => [item.id, item]),
        );

        if (openOrders.length === 0) {
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

        return <OpenOrdersList locationId={props.locationId} initialOrders={openOrders} menuItemsMap={menuItemsMap} />;
    } catch (error) {
        throw error instanceof AppError
            ? error
            : new AppError({
                internalMessage: `Unexpected error in OpenOrdersList: ${typeof error === 'object' && error !== null && 'toString' in error
                    ? (error as { toString: () => string }).toString()
                    : String(error)
                    }`,
                publicMessage: 'Failed to load orders. Please try refreshing the page.',
            });
    }
}
