'use client';

import { useAtom } from 'jotai';
import { PlusIcon, SoupIcon, WineIcon } from 'lucide-react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { Badge } from '~/components/ui/badge';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';
import { MENU_MODES, type MenuModeId } from '~/domain/menu-modes';
import { toast } from '~/hooks/use-toast';
import { getTopPositionedToast } from '~/lib/toast-utils';

export function PublicMenuItem(props: { item: MenuItem; currencyId: CurrencyId; menuMode: MenuModeId }) {
    const { name, description, price, isNew, type } = props.item;
    const currency = CURRENCIES[props.currencyId];
    const [, setOrder] = useAtom(orderAtom);

    const menuMode = MENU_MODES[props.menuMode];

    const addToOrder = () => {
        setOrder((prevOrder) => {
            const { id } = props.item;
            return {
                ...prevOrder,
                items: [
                    ...prevOrder.items,
                    {
                        menuItemId: id,
                        orderItem: { isDelivered: false, isPaid: false },
                    },
                ],
            };
        });

        toast({
            title: `${name} was added to your cart`,
            description: `Press 'Order now!' when you're ready to place your order.`,
            className: getTopPositionedToast(),
        });
    };

    return (
        <div className="flex w-full flex-row items-center pt-2 pb-2 text-sm gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                {type === 'dish' ? <SoupIcon /> : <WineIcon />}
            </div>
            <div className="flex flex-col">
                <div className="font-semibold">
                    {name}{' '}
                    {isNew && (
                        <Badge className="uppercase" variant={'default'}>
                            new!
                        </Badge>
                    )}
                </div>
                <div className="text-xs">{description}</div>{' '}
                <div>
                    {price} {currency.symbol}
                </div>
            </div>
            {menuMode.allowsAddToOrder && (
                <div className="ml-auto">
                    <PlusIcon className="cursor-pointer hover:text-blue-500 transition-colors" onClick={addToOrder} />
                </div>
            )}
        </div>
    );
}
