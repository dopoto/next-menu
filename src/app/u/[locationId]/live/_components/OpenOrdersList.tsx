import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { type LocationId } from '~/domain/locations';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';

export async function OpenOrdersList(props: { locationId: LocationId }) {
    //TODO: Fetch actual open orders
    const items = await Promise.resolve([]);

    if (items.length === 0) {
        const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;
        const title = 'No open orders at the moment';
        const secondary = hasAddedMenus
            ? 'Please come back in a while.'
            : 'For orders to flow in, start by adding one or more menus.';
        return (
            <EmptyState
                icon={<LayoutDashboard size={36} />}
                title={title}
                secondary={secondary}
                cta={hasAddedMenus ? undefined : 'Add menu'}
                ctaHref={hasAddedMenus ? undefined : ROUTES.menusAdd(props.locationId)}
            />
        );
    }

    return <div>Open orders</div>;
}
