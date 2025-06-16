// 'use client';

// import { useAtomValue } from 'jotai';
// import { openOrdersAtom, menuItemsAtom } from './_state/atoms';
// import type { PublicOrderWithItems } from '~/domain/orders';
// import type { CurrencyId } from '~/domain/currencies';
// import type { PublicOrderItem } from '~/domain/order-items';
// import type { MenuItem } from '~/domain/menu-items';

// function formatPrice(price: number | string, currencyId: CurrencyId) {
//     const formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: currencyId,
//     });
//     return formatter.format(typeof price === 'string' ? parseFloat(price) : price);
// }

// function OrderItemRow({ item, menuItems, currencyId }: { item: PublicOrderItem; menuItems: Map<number, MenuItem>; currencyId: CurrencyId }) {
//     const menuItem = menuItems.get(item.menuItemId);
//     return (
//         <li className="flex items-center justify-between border-b last:border-0 py-2">
//             <div>
//                 <p className="font-medium">{menuItem?.name ?? `Item #${item.menuItemId}`}</p>
//                 {menuItem?.description && <p className="text-sm text-muted-foreground">{menuItem.description}</p>}
//             </div>
//             <div className="flex items-center gap-4">
//                 {menuItem && (
//                     <span className="text-sm font-medium">
//                         {formatPrice(menuItem.price, currencyId)}
//                     </span>
//                 )}
//                 <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
//                     {item.orderItem.deliveryStatus}
//                 </span>
//             </div>
//         </li>
//     );
// }

// function OrderCard({ order, menuItems }: { order: PublicOrderWithItems; menuItems: Map<number, MenuItem> }) {
//     const total = order.items.reduce((sum, item) => {
//         const menuItem = menuItems.get(item.menuItemId);
//         return sum + (menuItem ? parseFloat(menuItem.price) : 0);
//     }, 0);

//     return (
//         <div className="rounded-lg border bg-card p-4 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h3 className="font-semibold">Order #{order.id}</h3>
//                     <p className="text-sm text-muted-foreground">
//                         Created: {new Date(order.createdAt).toLocaleString()}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-xl font-semibold">
//                         {formatPrice(total, order.currencyId)}
//                     </p>
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <h4 className="mb-2 font-medium">Items:</h4>
//                 <ul className="divide-y">
//                     {order.items.map((item, index) => (<OrderItemRow
//                         key={item.orderItem.id ?? index}
//                         item={item}
//                         currencyId={order.currencyId}
//                         menuItems={menuItems}
//                     />
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default function OrdersPage() {
//     const openOrders = useAtomValue(openOrdersAtom);
//     const menuItems = useAtomValue(menuItemsAtom);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="mb-6 text-2xl font-bold">Open Orders</h1>

//             <div className="grid gap-4">
//                 {openOrders.map((order) => (
//                     <OrderCard
//                         key={order.id}
//                         order={order}
//                         menuItems={menuItems}
//                     />
//                 ))}

//                 {openOrders.length === 0 && (
//                     <div className="rounded-lg border p-8 text-center">
//                         <p className="text-muted-foreground">No open orders</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
