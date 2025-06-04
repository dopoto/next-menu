import { useAtom } from 'jotai';
import { Trash2Icon } from 'lucide-react';
import { menuItemsAtom } from '~/app/p/[locationSlug]/_state/menu-items-atom';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { CURRENCIES } from '~/domain/currencies';
import { type OrderItemId, type PublicOrderItem } from '~/domain/order-items';

export function OrderItemsList(props: { items: PublicOrderItem[], onDelete?: (orderItemId: OrderItemId) => void }) {
    const [order] = useAtom(orderAtom);
    const [menuItems] = useAtom(menuItemsAtom);
    const currency = CURRENCIES[order.currencyId];


    return (
        <>
            {props.items?.map((item, index) => {
                const menuItem = menuItems.get(item.menuItemId) ?? { name: 'Unknown item', price: 0 };
                const { name, price } = menuItem;
                return (
                    <div key={index} className="flex w-full flex-row items-center text-sm pt-1 gap-1">
                        {props.onDelete && <Trash2Icon size={12} onClick={() => props.onDelete?.(item.orderItem.id ?? 0)} />} 1 x {name}, {price} {currency?.symbol}
                    </div>
                );
            })}
        </>
    );
}

// TODO key
