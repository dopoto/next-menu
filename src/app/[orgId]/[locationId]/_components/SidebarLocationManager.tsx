"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";

export function SidebarLocationManager() {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  const claims = user?.publicMetadata as CustomJwtSessionClaims;
  const locationName = claims?.currentLocationName?.toString() ?? "Loading...";

  return (
    <SidebarMenu>
      {/* <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-t-2 data-[state=open]:border-b-2 rounded-none border-dotted border-gray-200 dark:border-gray-600"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-tiny truncate antialiased">
                  LOCATION
                </span>
                <span className="truncate font-semibold">{locationName}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-popover border-border w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border p-2 shadow-md"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground">
              <div className="w-full bg-amber-50">TODO</div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem> */}
            <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {locationName.slice(0,3).toLocaleUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-tiny truncate antialiased">
                    LOCATION
                  </span>
                  <span className="truncate font-semibold">{locationName}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
               
            </DropdownMenuLabel>
              
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
