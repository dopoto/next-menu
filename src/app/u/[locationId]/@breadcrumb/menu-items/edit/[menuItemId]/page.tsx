import { TopBreadcrumb } from '~/app/u/[locationId]/@breadcrumb/_components/TopBreadcrumb';
import { NAV_ITEMS, type NavItem } from '~/domain/nav';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';

type Params = Promise<{ locationId: string }>;

export default async function EditMenuItemBreadcrumbSlot({ params }: { params: Params }) {
    const items: NavItem[] = [NAV_ITEMS.menuItems, NAV_ITEMS.menuItemsEdit];
    const currentItem: NavItem = NAV_ITEMS.menuItemsEdit;
    const locationId = getValidLocationIdOrThrow((await params).locationId);

    return <TopBreadcrumb items={items} currentItem={currentItem} locationId={locationId} />;
}
