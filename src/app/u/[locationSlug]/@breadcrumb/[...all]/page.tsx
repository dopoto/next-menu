'use client';

import { useParams, usePathname } from 'next/navigation';
import { TopBreadcrumb } from '~/app/u/[locationSlug]/@breadcrumb/_components/TopBreadcrumb';
import { NAV_TREE } from '~/domain/nav';
import { findNavItemByPath, getBreadcrumbPath } from '~/lib/nav-utils';

export default function BreadcrumbCatchAllSlot() {
    const pathname = usePathname();
    const { locationId } = useParams<{ locationId: string }>();
    const parsedLocationId = Number(locationId); //TODO Better validation

    const currentItem = findNavItemByPath(NAV_TREE, pathname, parsedLocationId);

    const items = currentItem ? getBreadcrumbPath(NAV_TREE, currentItem.id).filter((item) => item.id !== 'ROOT') : [];

    return <TopBreadcrumb items={items} currentItem={currentItem} locationId={parsedLocationId} />;
}
