import { House, MessageCircleQuestion } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';
import { AppVersion } from '~/app/_components/AppVersion';
import { APP_CONFIG } from '~/app/_config/app-config';
import { CookieKey } from '~/app/_domain/cookies';
import { MainContainer } from '~/app/u/[locationId]/_components/MainContainer';
import { SidebarLocationManager } from '~/app/u/[locationId]/_components/SidebarLocationManager';
import { Separator } from '~/components/ui/separator';
import { SidebarInset } from '~/components/ui/sidebar';

import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { ROUTES } from '~/lib/routes';

type Params = Promise<{ locationId: string }>;

export default async function Layout({
    params,
    breadcrumb,
    children,
}: {
    params: Params;
    breadcrumb: React.ReactNode;
    children: React.ReactNode;
}) {
    // TODO all basic checks
    // valid stripe and clerk?
    // valid location id, matches claims?

    const locationId = (await params).locationId;
    const validLocationId = getValidLocationIdOrThrow(locationId);

    const sidebarStateCookie = (await cookies()).get(CookieKey.SidebarState);
    const isSidebarExpanded = sidebarStateCookie ? sidebarStateCookie.value === 'true' : true;

    return (
        <MainContainer
            isSidebarExpanded={isSidebarExpanded}
            locationManager={<SidebarLocationManager locationId={validLocationId} />}
            breadcrumb={breadcrumb}
        >
            <SidebarInset>
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
        </MainContainer>
    );
}
