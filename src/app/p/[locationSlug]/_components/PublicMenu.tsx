'use client';

import { useAtom } from 'jotai';
import { PlusIcon } from 'lucide-react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { type CurrencyId } from '~/domain/currencies';
import { type MenuItemId, type MenuItemWithSortOrder } from '~/domain/menu-items';
import { MENU_MODES, type MenuModeId } from '~/domain/menu-modes';
import { type PublicOrderItem } from '~/domain/order-items';
import { toast } from '~/hooks/use-toast';
import { getTopPositionedToast } from '~/lib/toast-utils';

export function PublicMenu(props: {
    name: string;
    currencyId: CurrencyId;
    menuMode: MenuModeId;
    items: MenuItemWithSortOrder[];
}) {
    const [, setOrder] = useAtom(orderAtom);

    const addToOrder = (id: MenuItemId, name: string) => {
        setOrder((prevOrder) => {
            const newOrderItem: PublicOrderItem = {
                menuItemId: id,
                orderItem: {
                    tempId: Date.now().toString(),
                    isPaid: false,
                },
            };

            return {
                ...prevOrder,
                items: [...prevOrder.items, newOrderItem],
            };
        });

        toast({
            title: `${name} was added to your cart`,
            description: `Press 'Order now!' when you're ready to place your order.`,
            className: getTopPositionedToast(),
        });
    };

    const menuConfig = MENU_MODES[props.menuMode];

    return (
        <>
            <h1>{props.name}</h1>
            {props.items?.map((item) => {
                return (
                    <PublicMenuItem
                        key={item.id}
                        item={item}
                        currencyId={props.currencyId}
                        menuMode={props.menuMode}
                        actionComponent={
                            menuConfig.allowsAddToOrder ? (
                                <div className="ml-auto w-[40px] h-[40px] rounded-full bg-accent-foreground items-center-safe flex justify-center-safe">
                                    <PlusIcon
                                        strokeWidth={2}
                                        className="cursor-pointer text-white transition-colors"
                                        onClick={() => addToOrder(item.id, item.name ?? 'Item')}
                                    />
                                </div>
                            ) : null
                        }
                    />
                );
            })}
        </>
    );
}
