import { atom } from 'jotai';
import { OrderItemStatus } from '~/domain/order-items';
import { type MenuItem } from './menu-items';

export interface CartItem {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price'>;
    status: OrderItemStatus;
}

export const cartAtom = atom<CartItem[]>([]);
