import { type InferSelectModel } from 'drizzle-orm';
import { FolderCheckIcon } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { CompletedOrders } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrders';
import { type LocationId } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { db } from '~/server/db';
import { type menuItems } from '~/server/db/schema';
import { getCompletedOrdersByLocation } from '~/server/queries/orders';

export async function CompletedOrdersList(props: { locationId: LocationId }) {
    try {
        const completedOrders = await getCompletedOrdersByLocation(props.locationId);
        if (!completedOrders) {
            throw new AppError({
                internalMessage: `Failed to fetch completed orders for location ${props.locationId}`,
                publicMessage: 'Failed to load completed orders. Please try refreshing the page.',
            });
        }

        const menuItemIds = completedOrders.flatMap((order) => order.items.map((item) => item.menuItemId));
        // TODO extract:
        const menuItemsData = (await db.query.menuItems.findMany({
            where: (menuItems, { inArray }) => inArray(menuItems.id, menuItemIds),
            columns: {
                id: true,
                name: true,
                imageId: true,
                price: true,
            },
        })) as InferSelectModel<typeof menuItems>[];

        // Create a map of menuItemId to menuItem for quick lookup
        const menuItemsMap = new Map<number, InferSelectModel<typeof menuItems>>(
            menuItemsData.map((item) => [item.id, item]),
        );

        if (completedOrders.length === 0) {
            const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;
            const title = 'No completed orders at the moment';
            const secondary = hasAddedMenus
                ? 'Please come back in a while.'
                : 'For orders to flow in, start by adding one or more menus.';
            return (
                <EmptyState
                    icon={<FolderCheckIcon size={36} />}
                    title={title}
                    secondary={secondary}
                    cta={hasAddedMenus ? undefined : 'Add menu'}
                    ctaHref={hasAddedMenus ? undefined : ROUTES.menusAdd(props.locationId)}
                />
            );
        }

        return <CompletedOrders locationId={props.locationId} initialOrders={completedOrders} menuItemsMap={menuItemsMap} />;
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
