import { useAtom } from 'jotai';
import { orderAtom, PublicOrderItem } from '~/app/p/[locationSlug]/_state/cart';
import { CURRENCIES } from '~/domain/currencies';

export function OrderItemsList(props: { items: PublicOrderItem[] }) {
    const [order] = useAtom(orderAtom);
    const currency = CURRENCIES[order.currencyId];

    return (
        <>
            {props.items?.map((item, index) => {
                return (
                    <div key={index} className="flex w-full flex-row items-center text-sm pt-1">
                        1 x {item.menuItem.name}, {item.menuItem.price} {currency?.symbol}
                    </div>
                );
            })}
        </>
    );
}

// TODO key
