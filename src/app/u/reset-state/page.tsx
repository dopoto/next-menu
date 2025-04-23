import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CookieKey } from '~/app/_domain/cookies';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { ROUTES } from '~/lib/routes';
import { getLocation } from '~/server/queries/location';
import { setLocationIdCookie } from '../../actions/setLocationIdCookie';

/**
 * We redirect users here to attempt to recover their state in case of certain issues, e.g.:
 * (1) Missing or invalid location id cookie
 */
export default async function ResetStatePage() {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
        redirect(ROUTES.signIn);
    }

    const cookieStore = await cookies();

    // (1). Missing or invalid location id cookie
    const locationId = cookieStore.get(CookieKey.CurrentLocationId)?.value;
    if (!locationId) {
        const initialLocationId = sessionClaims?.metadata.initialLocationId;
        const validLocationId = getValidLocationIdOrThrow(initialLocationId);
        const locationData = await getLocation(validLocationId);
        if (locationData) {
            await setLocationIdCookie(locationData.id);
            redirect(ROUTES.my);
        }
    }

    return <>Could not recover. Please delete your cookies and try signing in again.</>;
}
