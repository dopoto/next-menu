import { CirclePlusIcon, UtensilsCrossedIcon } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { type LocationId } from '~/lib/location';
import { ROUTES } from '~/lib/routes';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import MenuItemCard from './MenuItemCard';

export async function MenusItemsList(props: { locationId: LocationId }) {
    const items = await getMenuItemsByLocation(props.locationId);
    return (
        <div className="flex h-full flex-col  ">
            <Link
                className="flex w-full flex-row items-center-safe justify-center-safe gap-2 rounded-sm border-1 border-dashed p-4 font-bold"
                href={ROUTES.menuItemsAdd(props.locationId)}
            >
                <CirclePlusIcon /> <span>Add menu item...</span>
            </Link>

            {items.length === 0 && (
                <EmptyState
                    icon={<UtensilsCrossedIcon size={36} />}
                    title={'No dishes or drinks found'}
                    secondary={''}
                />
            )}
            {items.map((menuItem) => (
                <div className="border-b-2 border-b-slate-200 border-dotted w-full" key={menuItem.id}>
                    <MenuItemCard key={menuItem.id} locationId={props.locationId} item={menuItem} />
                </div>
            ))}
        </div>
    );
}
