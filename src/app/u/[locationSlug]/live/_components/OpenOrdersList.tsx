import { api } from 'convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationSlug]/_components/EmptyState';
import { LiveOrders } from '~/app/u/[locationSlug]/live/_components/LiveOrders';
import { type LocationId } from '~/domain/locations';
import { MenuItemId, MenuItem } from '~/domain/menu-items';
import { PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { db } from '~/server/db';
//import { getOpenOrdersByLocation } from '~/server/queries/orders';

export async function OpenOrdersList(props: { locationId: LocationId }) {
    try {
        const openOrders = [] as PublicOrderWithItems[]
        //TODO await getOpenOrdersByLocation(props.locationId);

        const menuItemsData = await fetchQuery(api.menuItems.listPublicMenuItems, { locationId: props.locationId })
        const menuItemsMap = new Map<MenuItemId, MenuItem>(menuItemsData.map((item) => [item._id, item]));

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

        return <LiveOrders locationId={props.locationId} initialOrders={openOrders} menuItemsMap={menuItemsMap} />;
    } catch (error) {
        //TODO revisit
        console.error('Error in OpenOrdersList:', error);
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
