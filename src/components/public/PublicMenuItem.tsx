'use client';

import { SoupIcon, WineIcon } from 'lucide-react';
import Image from 'next/image';
import EllipsisText from '~/components/EllipsisText';
import { Badge } from '~/components/ui/badge';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';
import { type MenuModeId } from '~/domain/menu-modes';
import { getCloudinaryScaledImageUrl } from '~/services/cloudinary/cloudinary-utils';

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
            {props.item.imageId && props.item.imageId.length > 0 ? (
                <div className="flex items-center justify-center min-w-[60px] min-h-[60px] w-[60px] h-[60px] rounded-xl  overflow-hidden">
                    <Image
                        src={getCloudinaryScaledImageUrl(props.item.imageId)}
                        alt={name ?? 'Menu item image'}
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center min-w-[60px] min-h-[60px] w-[60px] h-[60px] rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {type === 'dish' ? <SoupIcon /> : <WineIcon />}
                </div>
            )}
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
