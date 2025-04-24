import { SoupIcon, WineIcon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { type MenuItem } from '~/domain/menu-items';

export function PublicMenuItem(props: { item: Partial<MenuItem> }) {
    const { name, description, price, isNew, type } = props.item;
    return (
        <div className="flex w-full flex-row items-center pt-2 pb-2 text-sm gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
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
                <div className="text-xs">{description}</div>
            </div>
            <div className="ml-auto">{price}</div>
        </div>
    );
}
