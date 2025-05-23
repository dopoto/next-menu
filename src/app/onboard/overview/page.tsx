import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { Overview } from '~/app/onboard/_components/Overview';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { SuccessAnimation } from '~/components/SuccessAnimation';
import { APP_CONFIG } from '~/config/app-config';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Overview`,
};

export default async function OverviewPage() {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        redirect(ROUTES.signUp);
    }

    const priceTierId = sessionClaims?.metadata?.tier;
    const parsedTier = getValidPriceTier(priceTierId);

    if (!parsedTier) {
        redirect(ROUTES.onboardSelectPlan);
    }
    const parsedTierId = parsedTier.id;

    return (
        <>
            <SplitScreenContainer
                mainComponent={<Overview claims={sessionClaims} />}
                secondaryComponent={<OnboardingStepper currentStep={'overview'} tierId={parsedTierId} />}
                title={'Welcome!'}
                subtitle={'Your onboarding is now completed'}
            ></SplitScreenContainer>
            <SuccessAnimation />
        </>
    );
}
