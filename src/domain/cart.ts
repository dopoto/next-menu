import { atom } from 'jotai';
import { type MenuItem } from './menu-items';

type OrderOnlyCartItemStatus = 'draft' | 'ordered' | 'delivered' | 'paid';
type PrepaidCartItemStatus = 'draft' | 'paid';

export interface CartItem {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price'>;

    status: OrderOnlyCartItemStatus | PrepaidCartItemStatus;
}

export const cartAtom = atom<CartItem[]>([]);
