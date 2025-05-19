import { atom } from 'jotai';
import type { MenuItem } from '~/domain/menu-items';

export const menuItemsAtom = atom<MenuItem[]>([]);
menuItemsAtom.debugLabel = 'menuItemsAtom';
