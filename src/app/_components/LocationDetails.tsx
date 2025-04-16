import { auth } from '@clerk/nextjs/server';
import { ExternalLinkIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import truncateMiddle from 'truncate-middle';
import { CopyButton } from '~/app/_components/CopyButton';
import { SeparatorWithText } from '~/app/_components/SeparatorWithText';
import { type LocationId, locationIdSchema } from '~/app/u/[locationId]/_domain/locations';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';
import { getLocation } from '~/server/queries';

export async function LocationDetails(props: { id: LocationId }) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No orgId or userid found in auth.`,
        });
    }

    const validationResult = locationIdSchema.safeParse(props.id);
    if (!validationResult.success) {
        // TODO Test
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(props)}`,
        });
    }
    const parsedLocationId = validationResult.data;

    const locationData = await getLocation(parsedLocationId);

    if (!locationData.slug) {
        throw new AppError({
            internalMessage: `Missing slug for location ${parsedLocationId}`,
        });
    }

    const locationUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.publicLocation(locationData.slug)}`;
    const locationName = locationData.name ?? '';

    return (
        <div className="flex w-full flex-col flex-nowrap gap-4">
            <div className="flex w-full gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                    {locationName.slice(0, 3).toLocaleUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="text-tiny truncate antialiased">LOCATION</span>
                    <span className="truncate font-semibold">{locationName}</span>
                </div>
            </div>
            <p className="text-center text-sm">Your location is live here:</p>
            <div className="flex w-full flex-row flex-nowrap gap-2 rounded">
                <a title={locationUrl} href={locationUrl} target="_blank">
                    <ExternalLinkIcon className="stroke-gray-700" />
                </a>
                <div className="grow">
                    <a
                        title={locationUrl}
                        href={locationUrl}
                        target="_blank"
                        className="font-normal text-blue-600 underline underline-offset-4"
                    >
                        <span className="max-[500px]:visible min-[501px]:hidden">
                            {truncateMiddle(locationUrl, 10, 10, '...')}
                        </span>
                        <span className="max-[500px]:hidden min-[501px]:visible">{locationUrl}</span>
                    </a>
                </div>
                <CopyButton textToCopy={locationUrl} />
            </div>
            <SeparatorWithText title="OR" />
            <div className="flex w-full items-center justify-center">
                <QRCode value={locationUrl} size={128} />
            </div>
        </div>
    );
}
