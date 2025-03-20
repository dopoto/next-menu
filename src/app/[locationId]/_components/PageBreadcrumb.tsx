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
import { ROUTES } from "~/app/_domain/routes";

export function PageBreadcrumb() {
  const pathname = usePathname();
  const currentPath = pathname.split("/").slice(2).join("/");
  const currentMenuItem = menuItems.find((item) => item.url === currentPath);
  const pageTitle = currentMenuItem?.title ?? "Dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentMenuItem?.url !== "" && (
          <><BreadcrumbItem className="hidden md:block">
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
