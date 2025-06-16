// import { FolderCheckIcon } from 'lucide-react';
// import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
 
// import { type LocationId } from '~/domain/locations';
// import { AppError } from '~/lib/error-utils.server';
// import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
// import { ROUTES } from '~/lib/routes';
// import type { MenuItemId, MenuItem } from '~/domain/menu-items';
// import { getCompletedOrdersByLocation } from '~/server/queries/orders';
// import { getMenuItemsByLocation } from '~/server/queries/menu-items';

// export async function CompletedOrders(props: { locationId: LocationId }) {
//     try {
//         const completedOrders = await getCompletedOrdersByLocation(props.locationId);
//         if (!completedOrders) {
//             throw new AppError({
//                 internalMessage: `Failed to fetch completed orders for location ${props.locationId}`,
//                 publicMessage: 'Failed to load completed orders. Please try refreshing the page.',
//             });
//         }

//         const menuItems = await getMenuItemsByLocation(props.locationId);
//         const menuItemsMap = new Map<MenuItemId, MenuItem>(
//             menuItems.map((item) => [item.id, item]),
//         );

//         if (completedOrders.length === 0) {
//             const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;
//             const title = 'No completed orders at the moment';
//             const secondary = hasAddedMenus
//                 ? 'Please come back in a while.'
//                 : 'For orders to flow in, start by adding one or more menus.';
//             return (
//                 <EmptyState
//                     icon={<FolderCheckIcon size={36} />}
//                     title={title}
//                     secondary={secondary}
//                     cta={hasAddedMenus ? undefined : 'Add menu'}
//                     ctaHref={hasAddedMenus ? undefined : ROUTES.menusAdd(props.locationId)}
//                 />
//             );
//         }

//         return <CompletedOrdersList locationId={props.locationId} initialOrders={completedOrders}
//             menuItemsMap={menuItemsMap} />;
//     } catch (error) {
//         throw error instanceof AppError
//             ? error
//             : new AppError({
//                 internalMessage: `Unexpected error in OpenOrdersList: ${typeof error === 'object' && error !== null && 'toString' in error
//                     ? (error as { toString: () => string }).toString()
//                     : String(error)
//                     }`,
//                 publicMessage: 'Failed to load orders. Please try refreshing the page.',
//             });
//     }
// }
