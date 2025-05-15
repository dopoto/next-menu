import { atom } from 'jotai';
import { z } from 'zod';
import { OrderItemStatus } from '~/domain/order-items';
import { orderFormSchema } from '~/domain/orders';
import { type MenuItem } from '../../../../domain/menu-items';

export type PublicOrder = z.infer<typeof orderFormSchema>;

export interface PublicOrderItem {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price'>;
    status: OrderItemStatus;
}

export const orderAtom = atom<PublicOrder>({ locationId: 0, items: [] });
orderAtom.debugLabel = 'orderAtom';
