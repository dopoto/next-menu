import { atom } from 'jotai';
import { OrderItemStatus } from '~/domain/order-items';
import { OrderId } from '~/domain/orders';
import { type MenuItem } from '../../../../domain/menu-items';

export interface PublicOrder {
    orderId: OrderId | null;
    items: PublicOrderItem[];
}

export interface PublicOrderItem {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price'>;
    status: OrderItemStatus;
}

export const orderAtom = atom<PublicOrder>({ orderId: null, items: [] });
