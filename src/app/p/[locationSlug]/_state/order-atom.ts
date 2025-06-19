import { atom } from 'jotai';
import { type PublicOrderWithItems } from '~/domain/orders';

export const orderAtom = atom<Partial<PublicOrderWithItems>>({});
orderAtom.debugLabel = 'orderAtom';
