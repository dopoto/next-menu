import { Suspense } from 'react';
import { getValidLocationIdOrThrow } from '~/app/_utils/location-utils';
import LoadingSection from '../_components/LoadingSection';
import { MenusItemsList } from './_components/MenuItemsList';

type Params = Promise<{ locationId: string }>;

export default async function MenuItemsPage(props: { params: Params }) {
    const params = await props.params;
    const parsedlocationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <MenusItemsList locationId={parsedlocationId} />
            </Suspense>
        </div>
    );
}
