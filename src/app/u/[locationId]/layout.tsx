import { House, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { AppVersion } from '~/app/_components/AppVersion';
import { ThemeSwitch } from '~/app/_components/ThemeSwitch';
import { APP_CONFIG } from '~/app/_config/app-config';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { ROUTES } from '~/lib/routes';
import { LocationSidebar } from './_components/LocationSidebar';

export default async function Layout({
    breadcrumb,
    children,
}: {
    breadcrumb: React.ReactNode;
    children: React.ReactNode;
}) {
    // TODO all basic checks
    // valid stripe and clerk?
    // valid location id, matches claims?

    return (
        <SidebarProvider>
            <LocationSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4!" />
                        {breadcrumb}
                    </div>
                    <div className="ml-auto px-4">
                        <ThemeSwitch />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                <footer className="flex gap-4 p-4 pt-0 text-xs">
                    <AppVersion />
                    <div className="ml-auto flex gap-2 align-middle">
                        <Link className="flex gap-0.5 align-middle" href={ROUTES.home}>
                            <House size={14} /> Home
                        </Link>
                        <Separator orientation="vertical" />
                        <Link
                            prefetch={false}
                            className="flex gap-0.5 align-middle"
                            href={`mailto: ${APP_CONFIG.supportEmail}?subject=Support Request`}
                        >
                            <MessageCircleQuestion size={14} /> Support
                        </Link>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}
