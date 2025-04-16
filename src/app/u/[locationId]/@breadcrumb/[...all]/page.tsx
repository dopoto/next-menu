"use client";

import { usePathname, useParams } from "next/navigation";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage as BreadcrumbPageComponent,
} from "~/components/ui/breadcrumb";
import React from "react";
import { ROUTES, type UserRouteFn } from "~/lib/routes";
import { findMenuItemByPath, getBreadcrumbPath } from "~/app/_utils/menu-utils";
import { menuTree } from "~/app/u/[locationId]/_domain/menu-sections";

export default function BreadcrumbCatchAllSlot() {
  const pathname = usePathname();
  const { locationId } = useParams<{ locationId: string }>();
  const parsedLocationId = Number(locationId); //TODO Better validation

  const currentMenuItem = findMenuItemByPath(
    menuTree,
    pathname,
    parsedLocationId,
  );

  const breadcrumbPath = currentMenuItem
    ? getBreadcrumbPath(menuTree, currentMenuItem.id).filter(
        (item) => item.id !== "ROOT",
      )
    : [];

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
        {breadcrumbPath.map((item, index) => {
          const isLast = index === breadcrumbPath.length - 1;
          if (!item.title) return null;

          return (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPageComponent className="capitalize">
                    {item.title}
                  </BreadcrumbPageComponent>
                ) : (
                  item.route && (
                    <BreadcrumbLink
                      href={(item.route as UserRouteFn)(parsedLocationId)}
                    >
                      {item.title}
                    </BreadcrumbLink>
                  )
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
