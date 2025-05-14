'use client';

import { useAtom } from 'jotai';
import { PlusIcon, SoupIcon, WineIcon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { cartAtom, type CartItem } from '~/domain/cart';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';
import { MenuModeId } from '~/domain/menu-modes';
import { toast } from '~/hooks/use-toast';

export function PublicMenuItem(props: { item: MenuItem; currencyId: CurrencyId; menuMode: MenuModeId }) {
    const { name, description, price, isNew, type } = props.item;
    const currency = CURRENCIES[props.currencyId];
    const [cart, setCart] = useAtom(cartAtom);

    const addToOrder = () => {
        const initialStatus: CartItem['status'] = 'draft';
        setCart([...cart, { menuItem: props.item, status: initialStatus }]);
        toast({
            title: 'Added to cart',
            description: `${name} has been added to your order.`,
        });
    };

    const hasAddIcon = props.menuMode === 'orderonly' || props.menuMode === 'prepaid';

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
            {hasAddIcon && (
                <div className="ml-auto">
                    <PlusIcon className="cursor-pointer hover:text-blue-500 transition-colors" onClick={addToOrder} />
                </div>
            )}
        </div>
    );
}
