import { ScanQrCode } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { type LocationId } from '~/app/u/[locationId]/_domain/locations';
import { ROUTES } from '~/lib/routes';
import { getMenusByLocation } from '~/server/queries/location';
import MenuCard from './MenuCard';

export async function MenusList(props: { locationId: LocationId }) {
    const items = await getMenusByLocation(props.locationId);

    if (items.length === 0) {
        const href = ROUTES.menusAdd(props.locationId);
        return (
            <EmptyState
                icon={<ScanQrCode size={36} />}
                title={'No menus found'}
                secondary={'This location does not have any menus yet. Add one below.'}
                cta={'Add menu'}
                ctaHref={href}
            />
        );
    }

    return (
        <div>
            {items.map((menu) => (
                <MenuCard key={menu.id} item={menu} />
            ))}
        </div>
    );
}
