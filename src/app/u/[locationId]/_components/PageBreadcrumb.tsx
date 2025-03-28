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
import { ROUTES, type UserRouteFn } from "~/app/_domain/routes";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";

function findMenuItemByPath(
  node: typeof menuTree,
  pathname: string,
  locationId: LocationId,
): typeof menuTree | undefined {
  if (node.route) {
    const itemFn = node.route as UserRouteFn;
    if (itemFn(locationId) === pathname) {
      return node;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findMenuItemByPath(child, pathname, locationId);
      if (found) return found;
    }
  }

  return undefined;
}

function getBreadcrumbPath(
  tree: typeof menuTree,
  targetId: string,
  path: (typeof menuTree)[] = [],
): (typeof menuTree)[] {
  if (tree.id === targetId) {
    return [...path, tree];
  }

  if (tree.children) {
    for (const child of tree.children) {
      const found = getBreadcrumbPath(child, targetId, [...path, tree]);
      if (found.length > 0) return found;
    }
  }

  return [];
}

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
