import { Suspense } from 'react';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import { getValidLocationIdOrThrow } from '~/lib/location';
import LoadingSection from '../_components/LoadingSection';
import { MenusItemsList } from './_components/MenuItemsList';

type Params = Promise<{ locationId: string }>;

export default async function MenuItemsPage(props: { params: Params }) {
    const params = await props.params;
    const parsedlocationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <FormTitle
                title="Menu items"
                subtitle="Your catalog of dishes and beverages. Each item can be used in one or more menus."
            />
            <Suspense fallback={<LoadingSection />}>
                <MenusItemsList locationId={parsedlocationId} />
            </Suspense>
        </div>
    );
}
