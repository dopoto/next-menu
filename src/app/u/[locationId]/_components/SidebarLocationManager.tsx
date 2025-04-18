'use client';

import { useUser } from '@clerk/nextjs';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SidebarMenuButton } from '~/components/ui/sidebar';
import { ROUTES } from '~/lib/routes';

export function SidebarLocationManager() {
    const { user } = useUser();
    const router = useRouter();
    const claims = user?.publicMetadata as CustomJwtSessionClaims;
    const locationId = claims?.currentLocationId?.toString() ?? '';
    const locationName = claims?.currentLocationName?.toString() ?? 'Loading...';

    const openLocation = () => {
        // TODO Validate location id
        const route = ROUTES.location(Number(locationId));
        router.push(route);
    };

    return (
        <>
            <SidebarMenuButton
                onClick={openLocation}
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    {locationName.slice(0, 3).toLocaleUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="text-tiny truncate antialiased">LOCATION</span>
                    <span className="truncate font-semibold">{locationName}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
            <div className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
                <DropdownMenuLabel className="text-muted-foreground text-xs"></DropdownMenuLabel>
            </div>
        </>
    );
}
