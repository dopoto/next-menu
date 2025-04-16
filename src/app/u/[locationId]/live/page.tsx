import { Suspense } from 'react';
import { AppError } from '~/lib/error-utils.server';
import LoadingSection from '../_components/LoadingSection';
import { locationIdSchema } from '../_domain/locations';
import { OpenOrdersList } from './_components/OpenOrdersList';

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
    const params = await props.params;

    const locationValidationResult = locationIdSchema.safeParse(params.locationId);
    if (!locationValidationResult.success) {
        throw new AppError({
            internalMessage: `Invalid location: ${params.locationId}`,
        });
    }

    return (
        <Suspense fallback={<LoadingSection />}>
            <OpenOrdersList locationId={locationValidationResult.data} />
        </Suspense>
    );
}
