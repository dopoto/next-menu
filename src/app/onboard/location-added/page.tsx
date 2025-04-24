import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { getValidPriceTier } from '~/app/_utils/price-tier-utils';
import { CookieKey } from '~/domain/cookies';
import { ROUTES } from '~/lib/routes';
import { LocationCreated } from '../_components/LocationCreated';
import { OnboardingStepper } from '../_components/OnboardingStepper';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Add location`,
};

export const dynamic = 'force-dynamic';

export default async function OnboardLocationAddedPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect(ROUTES.signIn);
    }

    const cookieStore = cookies();

    const locationName = (await cookieStore).get(CookieKey.CurrentLocationName)?.value;
    if (!locationName) {
        redirect(ROUTES.onboardAddLocation);
    }

    const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
    const parsedTier = getValidPriceTier(tier);
    if (!parsedTier) {
        redirect(ROUTES.onboardSelectPlan);
    }
    const parsedTierId = parsedTier.id;

    return (
        <SplitScreenContainer
            mainComponent={<LocationCreated locationName={locationName} />}
            secondaryComponent={<OnboardingStepper currentStep={'addLocation'} tierId={parsedTierId} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
