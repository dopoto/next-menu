'use client';

import { PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SidebarOrganizationManager } from '~/app/u/[locationId]/_components/SidebarOrganizationManager';
import { SidebarUserManager } from '~/app/u/[locationId]/_components/SidebarUserManager';
import { Button } from '~/components/ui/button';
import { SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '~/components/ui/sidebar';
import { MENU_TREE, NavItem } from '~/lib/nav';
import { UserRouteFn } from '~/lib/routes';

import { cn } from '~/lib/utils';

interface CustomSidebarProps {
    defaultExpanded?: boolean;
    children: React.ReactNode;
    locationManager: React.ReactNode;
}

export function CustomSidebar({ defaultExpanded = false, locationManager, children }: CustomSidebarProps) {
    const params = useParams();
    const { locationId } = params as { locationId: string };

    const dashboardMenuSection = MENU_TREE.children?.find((i) => i.id === 'dashboard')?.children ?? [];
    const locationManagerMenuSection = MENU_TREE.children?.find((i) => i.id === 'locationManager')?.children ?? [];

    const [expanded, setExpanded] = useState(defaultExpanded);

    // Update cookie when sidebar state changes
    const toggleSidebar = () => {
        const newState = !expanded;
        document.cookie = `sidebar_state=${newState}; path=/; max-age=31536000`; // 1 year
        setExpanded(newState);
    };

    // Set initial state from cookie on client side
    useEffect(() => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('sidebar_state='))
            ?.split('=')[1];

        if (cookieValue !== undefined) {
            setExpanded(cookieValue === 'true');
        }
    }, []);

    return (
        <SidebarProvider defaultOpen={expanded}>
            <div
                data-sidebar="sidebar"
                className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            >
                <div className="flex h-screen w-full overflow-hidden">
                    {/* Custom sidebar that's always visible */}
                    <div
                        className={cn(
                            'flex h-full flex-col bg-sidebar text-sidebar-foreground border-r transition-all duration-300',
                            expanded ? 'w-64' : 'w-16',
                        )}
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-2 p-2">{locationManager}</div>

                        {/* Content */}
                        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
                            {dashboardMenuSection.map((item) => (
                                <MenuItem item={item} locationId={locationId} expanded={expanded} />
                            ))}
                            {locationManagerMenuSection.map((item) => (
                                <MenuItem item={item} locationId={locationId} expanded={expanded} />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-2 p-2">
                            <SidebarOrganizationManager />
                            <SidebarUserManager />
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-1 flex-col overflow-auto">
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                            <div className="flex items-center gap-2 px-4">
                                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                                    <PanelLeft className="h-4 w-4" />
                                    <span className="sr-only">Toggle Sidebar</span>
                                </Button>
                            </div>
                        </header>
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}

function MenuItem(props: { item: NavItem; locationId: string; expanded: boolean }) {
    const pathname = usePathname();

    const buildUrl = (routeFn: UserRouteFn) => {
        return routeFn(Number(props.locationId));
    };

    const isActive = (route: string, children?: typeof MENU_TREE.children): boolean => {
        if (pathname === route || `${pathname}/` === route) return true;
        if (!children) return false;
        return children.some((child) => {
            const childRoute = buildUrl(child.route as (locationId: number) => string);
            return isActive(childRoute, child.children);
        });
    };

    const { item, expanded } = props;
    const href = buildUrl(item.route as (locationId: number) => string);
    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive(href, item.children)} tooltip={item.title}>
                {expanded ? (
                    <Link href={href} className="flex items-center gap-2">
                        <span title={item.title} className="flex-shrink-0">
                            {item.icon}
                        </span>
                        <span>{item.title}</span>
                    </Link>
                ) : (
                    <Link href={href} className="flex items-center justify-center-safe gap-2">
                        {item.icon}
                    </Link>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
