import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '~/components/ui/sidebar';
import { ROUTES } from '~/lib/routes';
import { LocationSlug } from '~/domain/locations';

export async function SidebarLocationManager(props: { locationSlug: LocationSlug, locationName: string }) {
    return (
        <a href={ROUTES.location(props.locationSlug)}>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    {props.locationName.slice(0, 3).toLocaleUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="text-tiny truncate antialiased">LOCATION</span>
                    <span className="truncate font-semibold">{props.locationName}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
            <div className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg">
                <DropdownMenuLabel className="text-muted-foreground text-xs"></DropdownMenuLabel>
            </div>
        </a>
    );
}
