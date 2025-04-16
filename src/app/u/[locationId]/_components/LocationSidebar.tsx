'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { type LocationId } from '~/app/u/[locationId]/_domain/locations';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '~/components/ui/sidebar';
import { type UserRouteFn } from '~/lib/routes';
import { MENU_TREE } from '../../../../lib/nav';
import { SidebarLocationManager } from './SidebarLocationManager';
import { SidebarOrganizationManager } from './SidebarOrganizationManager';
import { SidebarUserManager } from './SidebarUserManager';

export function LocationSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const params = useParams();
    const pathname = usePathname();
    const { locationId } = params as { locationId: string };

    const isActive = (route: string, children?: typeof MENU_TREE.children): boolean => {
        if (pathname === route || `${pathname}/` === route) return true;
        if (!children) return false;
        return children.some((child) => {
            const childRoute = buildUrl(child.route as (locationId: LocationId) => string);
            return isActive(childRoute, child.children);
        });
    };

    const buildUrl = (routeFn: UserRouteFn) => {
        return routeFn(Number(locationId));
    };

    const dashboardMenuSection = MENU_TREE.children?.find((i) => i.id === 'dashboard')?.children ?? [];
    const locationManagerMenuSection = MENU_TREE.children?.find((i) => i.id === 'locationManager')?.children ?? [];

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarLocationManager />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup key={'das'}>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {dashboardMenuSection.map((item) => {
                                const href = buildUrl(item.route as (locationId: LocationId) => string);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(href, item.children)}
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
                <SidebarGroup key={'locationManager'}>
                    <SidebarGroupLabel>Location Manager</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {locationManagerMenuSection.map((item) => {
                                const href = buildUrl(item.route as (locationId: LocationId) => string);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(href, item.children)}
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
