"use client";

import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { SidebarLocationManager } from "./SidebarLocationManager";
import { SidebarUserManager } from "./SidebarUserManager";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { menuItems } from "../_domain/menu-sections";
import { SidebarOrganizationManager } from "./SidebarOrganizationManager";
import { UserRouteFn, type AppRouteKey } from "~/app/_domain/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";

export function LocationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  const { locationId } = params as { locationId: string };

  const isActive = (route: string) => {
    return pathname === route || `${pathname}/` === route;
  };

  const buildUrl = (routeFn: UserRouteFn) => {
    // TODO Validate route
    return routeFn(Number(locationId));
  };

  const dashboardMenuSection = menuItems.filter(
    (i) => i.parentId === "dashboard",
  );
  const locationManagerMenuSection = menuItems.filter(
    (i) => i.parentId === "locationManager",
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLocationManager />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key={"das"}>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardMenuSection.map((item) => {
                const href = buildUrl(
                  item.route as (locationId: LocationId) => string,
                );
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(href)}
                      tooltip={item.title}
                    >
                      <Link href={href} className="flex items-center gap-2">
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup key={"locationManager"}>
          <SidebarGroupLabel>Location Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {locationManagerMenuSection.map((item) => {
                const href = buildUrl(
                  item.route as (locationId: LocationId) => string,
                );
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(href)}
                      tooltip={item.title}
                    >
                      <Link href={href} className="flex items-center gap-2">
                        <span title={item.title} className="flex-shrink-0">
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarOrganizationManager />
        <SidebarUserManager />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
