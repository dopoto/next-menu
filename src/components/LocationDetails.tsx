import { auth } from '@clerk/nextjs/server';
import { api } from 'convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { ExternalLinkIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import truncateMiddle from 'truncate-middle';
import { CopyButton } from '~/components/CopyButton';
import { SeparatorWithText } from '~/components/SeparatorWithText';
import { type LocationId } from '~/domain/locations';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';


export async function LocationDetails(props: { id: LocationId }) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No orgId or userid found in auth.`,
        });
    }

    const validLocation = await fetchQuery(api.locations.getLocationForCurrentUserOrThrow, { locationId: props.id })

    if (!validLocation.slug) {
        throw new AppError({
            internalMessage: `Missing slug for location ${props.id}`,
        });
    }

    const locationUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.publicLocation(validLocation.slug)}`;

    return (
        <div className="flex w-full flex-col flex-nowrap gap-4">
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
