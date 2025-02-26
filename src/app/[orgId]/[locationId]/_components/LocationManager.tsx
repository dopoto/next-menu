"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuShortcut } from "~/components/ui/dropdown-menu";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";

export function LocationManager() {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  const claims = user?.publicMetadata as CustomJwtSessionClaims;
  console.log(`DBG ${JSON.stringify(claims)}`);
  const locationName = claims?.currentLocationName?.toString() ?? "Loading...";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-none border-t-2 border-b-2 border-dotted border-gray-200 dark:border-gray-600"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-tiny truncate antialiased">
                  CURRENT LOCATION
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
