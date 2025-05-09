import { Suspense } from 'react';
import { PublicMenus } from '~/app/p/[locationSlug]/_components/PublicMenus';
import { type CurrencyId } from '~/domain/currencies';
import { locationSlugSchema } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { getLocationPublicDataBySlug } from '~/server/queries/locations';

type Params = Promise<{ locationSlug: string }>;

export default async function Page({ params }: { params: Params }) {
    const locationSlug = (await params).locationSlug;
    // TODO Refactor - extract:
    const locationSlugValidationResult = locationSlugSchema.safeParse(locationSlug);
    if (!locationSlugValidationResult.success) {
        throw new AppError({
            internalMessage: `Invalid location: ${locationSlug}`,
        });
    }

    const parsedLocationSlug = locationSlugValidationResult.data;
    const location = await getLocationPublicDataBySlug(parsedLocationSlug);

    return (
        <Suspense fallback="Loading menus...">
            <PublicMenus locationId={location.id} currencyId={location.currencyId as CurrencyId} />
        </Suspense>
    );
}
