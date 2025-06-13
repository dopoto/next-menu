import { Suspense } from 'react';
import { FormTitle } from '~/app/u/[locationId]/_components/FormTitle';
import { LoadingSection } from '~/app/u/[locationId]/_components/LoadingSection';
import { MenusList } from '~/app/u/[locationId]/menus/_components/MenusList';
import { getValidLocationIdOrThrow } from '~/lib/location-utils';
import { ROUTES } from '~/lib/routes';

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
    const params = await props.params;
    const locationId = getValidLocationIdOrThrow(params.locationId);

    return (
        <div className="flex h-full flex-col gap-2">
            <FormTitle
                title="Menus"
                subtitle={
                    <span>
                        The digital menus shown on{' '}
                        <a className="blue-link" href={ROUTES.location(locationId)}>
                            your public location page
                        </a>
                    </span>
                }
            />
            <Suspense fallback={<LoadingSection />}>
                <MenusList locationId={locationId} />
            </Suspense>
        </div>
    );
}
