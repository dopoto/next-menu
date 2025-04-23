import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '~/components/ui/sidebar';
import { ROUTES } from '~/lib/routes';
import { getLocation } from '~/server/queries/location';

export async function SidebarLocationManager(props: { locationId: number }) {
    const location = await getLocation(props.locationId);
    return (
        <a href={ROUTES.location(location.id)}>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    {location.name.slice(0, 3).toLocaleUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="text-tiny truncate antialiased">LOCATION</span>
                    <span className="truncate font-semibold">{location.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
            <div className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg">
                <DropdownMenuLabel className="text-muted-foreground text-xs"></DropdownMenuLabel>
            </div>
        </a>
    );
}
