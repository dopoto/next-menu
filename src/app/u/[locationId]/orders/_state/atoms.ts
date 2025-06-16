import { atom } from 'jotai';
import type { MenuItem } from '~/domain/menu-items';
import type { PublicOrderWithItems } from '~/domain/orders';

// Base type for orders with UI state
export type OrderWithExpanded = PublicOrderWithItems & { isExpanded: boolean }

// Primary atoms for storing state
export const openOrdersAtom = atom<OrderWithExpanded[]>([]);
openOrdersAtom.debugLabel = 'openOrdersAtom';

export const completedOrdersAtom = atom<OrderWithExpanded[]>([]);
completedOrdersAtom.debugLabel = 'completedOrdersAtom';

export const menuItemsAtom = atom<Map<number, MenuItem>>(new Map());
menuItemsAtom.debugLabel = 'menuItemsAtom';

// Derived atoms for computed state
export const sortedOpenOrdersAtom = atom((get) => {
    const orders = get(openOrdersAtom);
    return [...orders].sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());
});

export const sortedCompletedOrdersAtom = atom((get) => {
    const orders = get(completedOrdersAtom);
    return [...orders].sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());
});

export const pendingOrderItemsCountAtom = atom((get) => {
    const orders = get(openOrdersAtom);
    return orders.reduce((total, order) =>
        total + order.items.filter(item => item.orderItem.deliveryStatus === 'pending').length,
        0
    );
});

// Utility atoms for loading states
export const isLoadingAtom = atom(false);
