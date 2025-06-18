import { atom } from 'jotai';
import { MenuItem, MenuItemId } from '~/domain/menu-items';

export const menuItemsAtom = atom<Map<MenuItemId, MenuItem>>(new Map());
menuItemsAtom.debugLabel = 'menuItemsAtom';
