"use client";

import { usePathname } from "next/navigation";
import { menuItems } from "../_domain/menu-sections";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import React from "react";
import { ROUTES, UserRouteFn } from "~/app/_domain/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";

export function PageBreadcrumb(props: { locationId: LocationId }) {
  const pathname = usePathname();
   
  const currentMenuItem = menuItems.find((item) => {
    const itemFn = item.route as UserRouteFn;
    const itemRoute = itemFn(props.locationId);
    return itemRoute === pathname;
  });
  const pageTitle = currentMenuItem?.title ?? "Dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentMenuItem?.route && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={ROUTES.my}>
                <HomeIcon size={16} />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
