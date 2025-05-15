import { atom } from 'jotai';
import { z } from 'zod';
import { CurrencyId } from '~/domain/currencies';
import { OrderItemStatus } from '~/domain/order-items';
import { orderFormSchema } from '~/domain/orders';
import { type MenuItem } from '../../../../domain/menu-items';

export type PublicOrder = z.infer<typeof orderFormSchema> & { currencyId: CurrencyId };

export interface PublicOrderItem {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price'>;
    status: OrderItemStatus;
}

export const orderAtom = atom<PublicOrder>({ locationId: 0, currencyId: 'USD', items: [] });
orderAtom.debugLabel = 'orderAtom';
