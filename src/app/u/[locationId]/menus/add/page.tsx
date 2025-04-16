import { locationIdSchema } from '~/app/u/[locationId]/_domain/locations';
import { AppError } from '~/lib/error-utils.server';

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
    const params = await props.params;
    const validationResult = locationIdSchema.safeParse(params.locationId);
    if (!validationResult.success) {
        // TODO Test
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(params)}`,
        });
    }

    // TODO const availableQuota = await getAvailableFeatureQuota("menus");

    return <>hi</>;
}
