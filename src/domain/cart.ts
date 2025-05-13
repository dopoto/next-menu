import { atom } from 'jotai';
import { type MenuItem } from './menu-items';

export interface CartItem {
    menuItem: Partial<MenuItem>;
    quantity: number;
}

export const cartAtom = atom<CartItem[]>([]);
