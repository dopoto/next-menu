import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '~/app/onboard/_components/CheckoutForm';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { APP_CONFIG } from '~/config/app-config';
import { CookieKey } from '~/domain/cookies';
import { AppError } from '~/lib/error-utils.server';
import { getValidPaidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Payment`,
};

export default async function OnboardPaymentPage() {
    const { userId, orgId } = await auth();
    if (!userId) {
        redirect(ROUTES.signUp);
    }
    if (!orgId) {
        redirect(ROUTES.onboardAddOrg);
    }

    const cookieStore = cookies();
    const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
    const parsedTier = getValidPaidPriceTier(tier);
    if (!parsedTier) {
        redirect(ROUTES.onboardSelectPlan);
    }

    const stripePriceId = parsedTier.stripePriceId;
    if (!stripePriceId) {
        throw new AppError({
            internalMessage: `Stripe price id not found for tier ${parsedTier.id}`,
        });
    }

    return (
        <SplitScreenContainer
            mainComponent={<CheckoutForm priceTierId={parsedTier.id} />}
            secondaryComponent={<OnboardingStepper currentStep={'pay'} tierId={parsedTier.id} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
