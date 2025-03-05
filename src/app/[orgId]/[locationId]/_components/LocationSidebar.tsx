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
import { BetweenHorizontalStart, LayoutDashboard, SquareMenu } from "lucide-react";

const data = {
  dashboardMenuSection: [
     
        {
          icon: <LayoutDashboard size={16} />,
          title: "Dashboard",
          url: "dashboard",
        },
     
        {
          icon: <BetweenHorizontalStart size={16} />,
          title: "Real-time orders",
          url: "dashboard/orders",
        },
   
  ],
  locationManagerMenuSection: [
    {
      title: "Location manager",
      url: "#",
      items: [
        {
          icon: <SquareMenu size={16} />,
          title: "Menus",
          url: "manage/menus",
        },
      ],
    },
  ],
};

export function LocationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  const { orgId, locationId } = params as { orgId: string; locationId: string };

  const isActive = (url: string) => {
    // For root URLs like "#", they shouldn't match as active
    if (url === "#") return false;

    // Construct the full path to compare with current pathname
    const fullPath = `/${orgId}/${locationId}/${url}`;
    return pathname === fullPath;
  };

  const buildUrl = (url: string) => {
    if (url === "#") return "#";
    return `/${orgId}/${locationId}/${url}`;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLocationManager />
      </SidebarHeader>
      <SidebarContent>
 
          <SidebarGroup key={'das'}>
 
            <SidebarGroupContent>
              <SidebarMenu>
                {data.dashboardMenuSection.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
           

        {data.locationManagerMenuSection.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserManager />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
