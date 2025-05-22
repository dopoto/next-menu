import { Suspense } from 'react';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import LoadingSection from '~/app/u/[locationId]/_components/LoadingSection';
import { MenusItemsList } from '~/app/u/[locationId]/menu-items/_components/MenuItemsList';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { getLocationPublicDataById } from '~/server/queries/locations';

type Params = Promise<{ locationId: string }>;

export default async function MenuItemsPage(props: { params: Params }) {
    const params = await props.params;
    const parsedlocationId = getValidLocationIdOrThrow(params.locationId);
    const location = await getLocationPublicDataById(parsedlocationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <FormTitle
                title="Menu items"
                subtitle="Your catalog of dishes and beverages. Each item can be used in one or more menus."
            />
            <Suspense fallback={<LoadingSection />}>
                <MenusItemsList locationId={parsedlocationId} currencyId={location.currencyId} />
            </Suspense>
        </div>
    );
}
