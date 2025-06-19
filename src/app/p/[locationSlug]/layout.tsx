import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import JotaiProviderWrapper from '~/app/p/[locationSlug]/_components/JotaiProviderWrapper';
import { PublicFooterInteractiveMode } from '~/app/p/[locationSlug]/_components/PublicFooterInteractiveMode';
import { AnalyticsEventSender } from '~/components/AnalyticsEventSender';
import { CookieKey } from '~/domain/cookies';
import { LocationId, locationSlugSchema } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
// import { getLocationPublicDataBySlug } from '~/server/queries/locations';
// import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { capturePublicLocationVisit } from './_actions/captureAnalytics';
import type { MenuItem } from '~/domain/menu-items';
import { CurrencyId } from '~/domain/currencies';

//TODO Use cache

type Params = Promise<{ locationSlug: string }>;

export default async function Layout({ params, children }: { params: Params; children: React.ReactNode }) {
    const locationSlug = (await params).locationSlug;
    // TODO Refactor - extract:
    const locationSlugValidationResult = locationSlugSchema.safeParse(locationSlug);
    if (!locationSlugValidationResult.success) {
        throw new AppError({
            internalMessage: `Invalid location: ${locationSlug}`,
        });
    }

    const parsedLocationSlug = locationSlugValidationResult.data;
    const location = await Promise.resolve({
        _id: "1" as LocationId, orgId: 1, clerkOrgId: "2", currencyId: 'USD' as CurrencyId,
        name: 'test', menuMode: 'interactive'
    })
    //TODO await getLocationPublicDataBySlug(parsedLocationSlug);

    const menuItems = [] as MenuItem[]; //TODO await getMenuItemsByLocation(location.id);

    const cookieStore = cookies();
    const machineId = (await cookieStore).get(CookieKey.MachineId)?.value;

    const organization = (await clerkClient()).organizations.getOrganization({ organizationId: location.clerkOrgId });
    const logo = (await organization).imageUrl ?? '/images/placeholder.svg?height=100&width=100';
    console.log('DBG', logo);

    await capturePublicLocationVisit(machineId, location.orgId, parsedLocationSlug);

    return (
        <JotaiProviderWrapper locationId={location._id} currencyId={location.currencyId} menuItems={menuItems}>
            <div className="mx-auto max-w-7xl px-2 pt-2 lg:px-8">
                <header className="w-full flex flex-row  items-center-safe gap-3">
                    <Image src={logo} alt="Logo" width={96} height={96} className=" w-24 h-24" />
                    <h1 className="text-3xl font-bold">{location.name}</h1>
                </header>

                <div className="max-w-6xl pb-[200px]">{children}</div>

                <AnalyticsEventSender
                    eventId="publicLocationVisit"
                    payload={{
                        orgId: location.orgId,
                        locationSlug: parsedLocationSlug,
                    }}
                />
            </div>
            {/* Footer */}
            {location.menuMode === 'interactive' && (
                <PublicFooterInteractiveMode currencyId={location.currencyId} locationId={location.id} />
            )}
        </JotaiProviderWrapper>
    );
}
