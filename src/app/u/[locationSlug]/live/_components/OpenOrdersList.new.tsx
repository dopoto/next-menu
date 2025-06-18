// import { LayoutDashboard } from 'lucide-react';
// import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
// import { LiveOrders } from '~/app/u/[locationId]/live/_components/LiveOrders';
// import { type LocationId } from '~/domain/locations';
// import { type OrderItemStatus } from '~/domain/order-items';
// import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
// import { ROUTES } from '~/lib/routes';
// import { db } from '~/server/db';

// export async function OpenOrdersList(props: { locationId: LocationId }) {
//     // Fetch all non-completed orders for this location
//     type OrderWithDetails = {
//         id: number;
//         locationId: number;
//         orderItems: Array<{
//             id: number;
//             orderId: number;
//             menuItemId: number;
//             status: string;
//             menuItem: {
//                 id: number;
//                 name: string | null;
//                 price: string;
//             };
//         }>;
//         createdAt: Date;
//         updatedAt: Date | null;
//     };

//     const openOrders = (await db.query.orders.findMany({
//         where: (orders, { eq }) => eq(orders.locationId, props.locationId),
//         with: {
//             orderItems: {
//                 columns: {
//                     id: true,
//                     status: true,
//                     orderId: true,
//                     menuItemId: true,
//                 },
//                 with: {
//                     menuItem: {
//                         columns: {
//                             id: true,
//                             name: true,
//                             price: true,
//                         },
//                     },
//                 },
//             },
//         },
//     })) as OrderWithDetails[];

//     const ordersWithItems = openOrders.map((order) => ({
//         ...order,
//         orderId: order.id.toString(),
//         items: order.orderItems.map((item) => ({
//             menuItem: {
//                 id: item.menuItem.id,
//                 name: item.menuItem.name ?? '',
//                 price: item.menuItem.price,
//             },
//             status: item.status as OrderItemStatus,
//         })),
//     }));

//     if (ordersWithItems.length === 0) {
//         const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;
//         const title = 'No open orders at the moment';
//         const secondary = hasAddedMenus
//             ? 'Please come back in a while.'
//             : 'For orders to flow in, start by adding one or more menus.';
//         return (
//             <EmptyState
//                 icon={<LayoutDashboard size={36} />}
//                 title={title}
//                 secondary={secondary}
//                 cta={hasAddedMenus ? undefined : 'Add menu'}
//                 ctaHref={hasAddedMenus ? undefined : ROUTES.menusAdd(props.locationId)}
//             />
//         );
//     }

//     return <LiveOrders locationId={props.locationId} initialOrders={ordersWithItems} />;
// }
