import { LayoutDashboard } from 'lucide-react';
import { EmptyState } from '~/app/u/[locationId]/_components/EmptyState';
import { OpenOrdersList } from '~/app/u/[locationId]/orders/open/_components/OpenOrdersList';
import { type LocationId } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { getUsedFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';

export async function OpenOrders(props: { locationId: LocationId }) {
    try {
        // Since data is loaded in the layout, we can directly render the OpenOrdersList
        // which will read from atoms
        const hasAddedMenus = (await getUsedFeatureQuota('menus')) > 0;

        if (!hasAddedMenus) {
            return (
                <EmptyState
                    icon={<LayoutDashboard size={36} />}
                    title="No open orders at the moment"
                    secondary="For orders to flow in, start by adding one or more menus."
                    cta="Add menu"
                    ctaHref={ROUTES.menusAdd(props.locationId)}
                />
            );
        }

        return <OpenOrdersList locationId={props.locationId} />;
    } catch (error) {
        throw error instanceof AppError
            ? error
            : new AppError({
                internalMessage: `Unexpected error in OpenOrdersList: ${typeof error === 'object' && error !== null && 'toString' in error
                    ? (error as { toString: () => string }).toString()
                    : String(error)
                    }`,
                publicMessage: 'Failed to load orders. Please try refreshing the page.',
            });
    }
}
