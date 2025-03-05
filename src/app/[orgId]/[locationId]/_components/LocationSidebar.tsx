"use client";

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
import SvgIcon from "~/app/_components/SvgIcons";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, SquareMenu } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          icon: <LayoutDashboard size={14}   />,
          title: "Real-time orders",
          url: "dashboard/orders",
        },
        
      ],
    },
    {
      title: "Location",
      url: "#",
      items: [
        {
          icon: <SquareMenu size={14}  />,
          title: "Menus",
          url: "manage/menus",
        },
      ],
    },
 
  ],
}

export function LocationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const params = useParams()
  const pathname = usePathname()
  const { orgId, locationId } = params as { orgId: string; locationId: string }

  // Function to check if a menu item is active
  const isActive = (url: string) => {
    // For root URLs like "#", they shouldn't match as active
    if (url === "#") return false

    // Construct the full path to compare with current pathname
    const fullPath = `/${orgId}/${locationId}/${url}`
    return pathname === fullPath
  }

  // Function to build the correct URL with dynamic segments
  const buildUrl = (url: string) => {
    if (url === "#") return "#"
    return `/${orgId}/${locationId}/${url}`
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex w-full flex-row p-2 pt-3 justify-center">
        <Link href="/my">
          <SvgIcon kind="logo" size={"8"} className="fill-rose-700" />
        </Link>
        
      </div>
      <SidebarHeader>
        <SidebarLocationManager />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={buildUrl(item.url)} className="flex items-center gap-2">
                        <span title={item.title} className="flex-shrink-0">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserManager />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
