"use client";

import { useParams } from "next/navigation";
import { TopBreadcrumb } from "~/app/u/[locationId]/@breadcrumb/_components/TopBreadcrumb";
import { NAV_ITEMS, NavItem } from "~/lib/nav";

export default async function EditMenuItemBreadcrumbSlot() {
  const items: NavItem[] = [NAV_ITEMS["menuItems"], NAV_ITEMS["menuItemsEdit"]];
  const currentItem: NavItem = NAV_ITEMS["menuItemsEdit"];

  const { locationId } = useParams<{ locationId: string }>();
  const parsedLocationId = Number(locationId); //TODO Better validation

  return (
    <TopBreadcrumb
      items={items}
      currentItem={currentItem}
      locationId={parsedLocationId}
    />
  );
}
