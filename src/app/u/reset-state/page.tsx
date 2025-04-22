/**
 * We redirect users here to attempt to recover their state in case of certain issues, e.g.:
 * (1) Missing or invalid location id cookie
 */
export default async function ResetStatePage() {
    // (1). Missing or invalid location id cookie
    //  const { userId, orgId } = await auth();
    //     if (!userId || !orgId) {
    //         throw new AppError({
    //             internalMessage: `No orgId or userid found in auth.`,
    //         });
    //     }
    //     const locationData = await getLocation(props.id);
    //     if (!locationData.slug) {
    //         throw new AppError({
    //             internalMessage: `Missing slug for location ${props.id}`,
    //         });
    //     }
    // TODO
    return <>Please delete cookies and try again.</>;
}
