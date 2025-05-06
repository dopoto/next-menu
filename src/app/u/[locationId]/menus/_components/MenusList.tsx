import { CirclePlusIcon, ScanQrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import MenuCard from '~/app/u/[locationId]/menus/_components/MenuCard';
import { type LocationId } from '~/domain/locations';
import { ROUTES } from '~/lib/routes';
import { getMenusByLocation } from '~/server/queries/menus';

export async function MenusList(props: { locationId: LocationId }) {
    const items = await getMenusByLocation(props.locationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <Link
                className="flex w-full flex-row items-center-safe justify-center-safe gap-2 rounded-sm border-1 border-dashed p-4 font-bold"
                href={ROUTES.menusAdd(props.locationId)}
            >
                <CirclePlusIcon /> <span>Add menu...</span>
            </Link>

            {items.length === 0 && (
                <EmptyState icon={<ScanQrCodeIcon size={36} />} title={'No menus found'} secondary={''} />
            )}
            {items.map((item) => (
                <div className="   w-full" key={item.id}>
                    <MenuCard key={item.id} locationId={props.locationId} item={item} />
                </div>
            ))}
        </div>
    );
}
