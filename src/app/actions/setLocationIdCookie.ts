'use server';

import { cookies } from 'next/headers';
import { CookieKey } from '~/app/_domain/cookies';

export async function setLocationIdCookie(locationId: number) {
    const cookieStore = await cookies();
    cookieStore.set(CookieKey.CurrentLocationId, locationId.toString());
    return { message: 'ok' };
}
