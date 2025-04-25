import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { EditMenu } from '~/app/u/[locationId]/menus/_components/EditMenu';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getValidMenuIdOrThrow } from '~/lib/menu-utils';
import { getMenuById } from '~/server/queries/menus';

type Params = Promise<{ locationId: string; menuId: string }>;

export default async function EditMenuPage(props: { params: Params }) {
    const params = await props.params;

    const validLocationId = getValidLocationIdOrThrow(params.locationId);
    const validMenuId = getValidMenuIdOrThrow(params.menuId);

    const menu = await getMenuById(validLocationId, validMenuId);

    if (!menu) {
        return notFound();
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <EditMenu locationId={validLocationId} menu={menu} />
            </Suspense>
        </div>
    );
}
