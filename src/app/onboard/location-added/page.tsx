import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { LocationCreated } from '~/app/onboard/_components/LocationCreated';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { CookieKey } from '~/domain/cookies';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

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
