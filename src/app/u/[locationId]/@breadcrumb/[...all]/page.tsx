'use client';

import { useParams, usePathname } from 'next/navigation';
import { findMenuItemByPath, getBreadcrumbPath } from '~/app/_utils/menu-utils';
import { TopBreadcrumb } from '~/app/u/[locationId]/@breadcrumb/_components/TopBreadcrumb';
import { MENU_TREE } from '~/lib/nav';

export default function BreadcrumbCatchAllSlot() {
    const pathname = usePathname();
    const { locationId } = useParams<{ locationId: string }>();
    const parsedLocationId = Number(locationId); //TODO Better validation

    const currentItem = findMenuItemByPath(MENU_TREE, pathname, parsedLocationId);

    const items = currentItem ? getBreadcrumbPath(MENU_TREE, currentItem.id).filter((item) => item.id !== 'ROOT') : [];

    return <TopBreadcrumb items={items} currentItem={currentItem} locationId={parsedLocationId} />;
}
