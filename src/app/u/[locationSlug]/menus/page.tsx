import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { FormTitle } from '~/app/u/[locationSlug]/_components/FormTitle';
import LoadingSection from '~/app/u/[locationSlug]/_components/LoadingSection';
import { MenusList } from '~/app/u/[locationSlug]/menus/_components/MenusList';
import { ROUTES } from '~/lib/routes';

type Params = Promise<{ locationId: string }>;

export default async function MenusPage(props: { params: Params }) {
    const params = await props.params;
    //const locationId = getValidLocationIdOrThrow(params.locationId);
    //TODO
    const validLocation = await fetchQuery(
        api.locations.getLocationForCurrentUserOrThrow,
        { locationId: Number(params.locationId) }
    )

    return (
        <div className="flex h-full flex-col gap-2">
            <FormTitle
                title="Menus"
                subtitle={
                    <span>
                        The digital menus shown on{' '}
                        <a className="blue-link" href={ROUTES.location(validLocation.slug)}>
                            your public location page
                        </a>
                    </span>
                }
            />
            <Suspense fallback={<LoadingSection />}>
                {/* TODO use slug  */}
                <MenusList locationId={1} />
            </Suspense>
        </div>
    );
}
