import { atom } from 'jotai';
import { PublicOrder } from '~/domain/orders';

export const orderAtom = atom<PublicOrder>({ locationId: 0, currencyId: 'USD', items: [] });
orderAtom.debugLabel = 'orderAtom';
