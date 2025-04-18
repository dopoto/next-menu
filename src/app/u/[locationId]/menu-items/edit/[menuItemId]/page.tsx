import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { EditMenuItem } from '~/app/u/[locationId]/menu-items/_components/EditMenuItem';
import { getValidLocationIdOrThrow } from '~/lib/location';
import { getValidMenuItemIdOrThrow } from '~/lib/menu-items';
import { getMenuItemById } from '~/server/queries/menu-items';
import LoadingSection from '../../../_components/LoadingSection';

type Params = Promise<{ locationId: string; menuItemId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
    const params = await props.params;

    const parsedLocationId = getValidLocationIdOrThrow(params.locationId);
    const parsedMenuItemId = getValidMenuItemIdOrThrow(params.menuItemId);

    const menuItemToEdit = await getMenuItemById(parsedLocationId, parsedMenuItemId);

    if (!menuItemToEdit) {
        return notFound();
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <Suspense fallback={<LoadingSection />}>
                <EditMenuItem locationId={parsedLocationId} menuItem={menuItemToEdit} />
            </Suspense>
        </div>
    );
}
