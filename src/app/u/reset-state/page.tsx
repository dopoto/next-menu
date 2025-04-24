export default async function ResetStatePage() {
    // const { userId, orgId, sessionClaims } = await auth();
    // if (!userId || !orgId) {
    //     redirect(ROUTES.signIn);
    // }

    // const cookieStore = await cookies();

    // // (1). Missing or invalid location id cookie
    // const locationId = cookieStore.get(CookieKey.CurrentLocationId)?.value;
    // if (!locationId) {
    //     const initialLocationId = sessionClaims?.metadata.initialLocationId;
    //     const validLocationId = getValidLocationIdOrThrow(initialLocationId);
    //     const locationData = await getLocation(validLocationId);
    //     if (locationData) {
    //         setLocationIdCookie(locationData.id);
    //         redirect(ROUTES.my);
    //     }
    // }

    return <>An error occurred. Please delete your cookies and try signing in again.</>;
}
