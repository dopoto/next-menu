import { Suspense } from 'react';
import { AppError } from '~/lib/error-utils.server';
import LoadingSection from '../_components/LoadingSection';
import { locationIdSchema } from '../_domain/locations';
import { MenusList } from './_components/MenusList';

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
    const params = await props.params;

    const locationValidationResult = locationIdSchema.safeParse(params.locationId);
    if (!locationValidationResult.success) {
        throw new AppError({
            internalMessage: `Location validation failed. params: ${JSON.stringify(params)}`,
        });
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <MenusList locationId={locationValidationResult.data} />
            </Suspense>
        </div>
    );
}
