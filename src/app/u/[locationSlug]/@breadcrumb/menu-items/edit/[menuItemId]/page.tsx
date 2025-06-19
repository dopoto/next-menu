import { TopBreadcrumb } from '~/app/u/[locationSlug]/@breadcrumb/_components/TopBreadcrumb';
import { UserRouteParamsPromise } from '~/app/u/[locationSlug]/params';
import { NAV_ITEMS, type NavItem } from '~/domain/nav';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

export default async function EditMenuItemBreadcrumbSlot({ params }: { params: UserRouteParamsPromise }) {
    const items: NavItem[] = [NAV_ITEMS.menuItems, NAV_ITEMS.menuItemsEdit];
    const currentItem: NavItem = NAV_ITEMS.menuItemsEdit;
    const locationId = getValidLocationIdOrThrow((await params).locationId);

    return <TopBreadcrumb items={items} currentItem={currentItem} locationId={locationId} />;
}
