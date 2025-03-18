"use client";

import React from 'react';
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

export function LocationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  const { locationId } = params as { locationId: string };

  const isActive = (url: string) => {
    const fullPath = `/${locationId}/${url}`;
    return pathname === fullPath || `${pathname}/` === fullPath;
  };

  const buildUrl = (url: string) => {
    return `/${locationId}/${url}`;
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
              {dashboardMenuSection.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link
                      href={buildUrl(item.url)}
                      className="flex items-center gap-2"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup key={"locationManager"}>
          <SidebarGroupLabel>Location Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {locationManagerMenuSection.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link
                      href={buildUrl(item.url)}
                      className="flex items-center gap-2"
                    >
                      <span title={item.title} className="flex-shrink-0">
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserManager />
        <SidebarOrganizationManager />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
