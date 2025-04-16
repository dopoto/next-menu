import { Suspense } from 'react';
import { getValidLocationIdOrThrow } from '~/lib/location';
import LoadingSection from '../_components/LoadingSection';
import { MenusList } from './_components/MenusList';

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <MenusList locationId={locationId} />
            </Suspense>
        </div>
    );
}
