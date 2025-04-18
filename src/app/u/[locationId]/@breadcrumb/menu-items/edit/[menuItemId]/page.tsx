import { TopBreadcrumb } from '~/app/u/[locationId]/@breadcrumb/_components/TopBreadcrumb';
import { getValidLocationIdOrThrow } from '~/lib/location';
import { NAV_ITEMS, type NavItem } from '~/lib/nav';

type Params = Promise<{ locationId: string }>;

export default async function EditMenuItemBreadcrumbSlot({ params }: { params: Params }) {
    const items: NavItem[] = [NAV_ITEMS.menuItems, NAV_ITEMS.menuItemsEdit];
    const currentItem: NavItem = NAV_ITEMS.menuItemsEdit;
    const locationId = getValidLocationIdOrThrow((await params).locationId);

    return <TopBreadcrumb items={items} currentItem={currentItem} locationId={locationId} />;
}
