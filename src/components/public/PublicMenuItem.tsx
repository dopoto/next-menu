'use client';

import EllipsisText from '~/components/EllipsisText';
import { MenuItemImage } from '~/components/MenuItemImage';
import { Badge } from '~/components/ui/badge';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';
import { type MenuModeId } from '~/domain/menu-modes';

export function PublicMenuItem(props: {
    item: MenuItem;
    currencyId: CurrencyId;
    menuMode: MenuModeId;
    actionComponent?: React.ReactNode;
}) {
    const { name, description, price, isNew, type } = props.item;
    const currency = CURRENCIES[props.currencyId];

    return (
        <div className="flex  w-full flex-row items-center pt-2 pb-2 text-sm gap-2">
            <MenuItemImage imageId={props.item.imageId} />
            <div className="flex flex-col min-w-0 flex-1 ">
                <div className="font-semibold">
                    {name}{' '}
                    {isNew && (
                        <Badge className="uppercase" variant={'default'}>
                            new!
                        </Badge>
                    )}
                </div>
                <div className="text-xs relative">
                    <EllipsisText text={description ?? ''} />
                </div>
                <div>
                    {price} {currency.symbol}
                </div>
            </div>
            {props.actionComponent}
        </div>
    );
}
