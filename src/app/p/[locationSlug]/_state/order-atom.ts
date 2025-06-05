import { atom } from 'jotai';
import { type PublicOrderWithItems } from '~/domain/orders';

export const orderAtom = atom<PublicOrderWithItems>({
    id: 0,
    createdAt: new Date(),
    updatedAt: null,
    locationId: 0,
    currencyId: 'USD',
    items: [],
});
orderAtom.debugLabel = 'orderAtom';
