import { cookies } from 'next/headers';
import Image from 'next/image';
import JotaiProviderWrapper from '~/app/p/[locationSlug]/_components/JotaiProviderWrapper';
import { PublicFooterInteractiveMode } from '~/app/p/[locationSlug]/_components/PublicFooterInteractiveMode';
import { AnalyticsEventSender } from '~/components/AnalyticsEventSender';
import { CookieKey } from '~/domain/cookies';
import { locationSlugSchema } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { getLocationPublicDataBySlug } from '~/server/queries/locations';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';
import { capturePublicLocationVisit } from './_actions/captureAnalytics';

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
    const location = await getLocationPublicDataBySlug(parsedLocationSlug);

    const menuItems = await getMenuItemsByLocation(location.id);

    const cookieStore = cookies();
    const machineId = (await cookieStore).get(CookieKey.MachineId)?.value;

    await capturePublicLocationVisit(machineId, location.orgId, parsedLocationSlug);

    return (
        <JotaiProviderWrapper locationId={location.id} currencyId={location.currencyId} menuItems={menuItems}>
            <div className="mx-auto max-w-7xl lg:px-8">
                <header className="w-full max-w-6xl mx-auto px-4 pt-2 md:pt-4">
                    <div className="relative">
                        <div className="w-full rounded-2xl overflow-hidden">
                            <Image
                                src="/images/placeholder.svg?height=300&width=1200"
                                alt="Hero banner"
                                width={1200}
                                height={300}
                                className="w-full h-48 md:h-64 object-cover"
                            />
                        </div>
                        <div className="flex justify-center md:justify-start md:absolute md:left-8 md:bottom-0 md:translate-y-1/2">
                            <div className="relative -mt-12 md:mt-0 rounded-full border-4 border-white bg-white shadow-md">
                                <Image
                                    src="/images/placeholder.svg?height=100&width=100"
                                    alt="Logo"
                                    width={100}
                                    height={100}
                                    className="rounded-full w-24 h-24"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center md:text-left md:pl-36">
                        <h1 className="text-3xl font-bold">{location.name}</h1>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-4">{children}</div>

                {location.menuMode === 'interactive' && (
                    <PublicFooterInteractiveMode currencyId={location.currencyId} locationId={location.id} />
                )}

                <AnalyticsEventSender
                    eventId="publicLocationVisit"
                    payload={{
                        orgId: location.orgId,
                        locationSlug: parsedLocationSlug,
                    }}
                />
            </div>
        </JotaiProviderWrapper>
    );
}
