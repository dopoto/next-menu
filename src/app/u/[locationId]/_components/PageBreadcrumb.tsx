"use client";

import { usePathname } from "next/navigation";
import { menuTree } from "../_domain/menu-sections";
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
import { ROUTES, type UserRouteFn } from "~/lib/routes";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { findMenuItemByPath, getBreadcrumbPath } from "~/app/_utils/menu-utils";

export function PageBreadcrumb(props: { locationId: LocationId }) {
  const pathname = usePathname();

  const currentMenuItem = findMenuItemByPath(
    menuTree,
    pathname,
    props.locationId,
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
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  item.route && (
                    <BreadcrumbLink
                      href={(item.route as UserRouteFn)(props.locationId)}
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
