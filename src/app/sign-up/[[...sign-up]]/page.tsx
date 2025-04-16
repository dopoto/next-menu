import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { getValidPriceTier } from '~/app/_utils/price-tier-utils';
import { ROUTES } from '~/lib/routes';
import { OnboardingStepper } from '../../onboard/_components/OnboardingStepper';

export const metadata = {
    title: `${APP_CONFIG.appName} - Sign up`,
};

type SearchParams = Promise<Record<'tier', string | undefined>>;

/**
 * Users that get here should already have chosen a tier - that
 * should be either in the search param or in a cookie.
 */
export default async function SignUpPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const tier = getValidPriceTier(searchParams.tier);

    if (!tier) {
        redirect(ROUTES.onboardSelectPlan);
    }

    return (
        <SplitScreenContainer
            mainComponent={
                <SignUp
                    appearance={{
                        elements: {
                            headerTitle: 'hidden',
                            headerSubtitle: 'hidden',
                        },
                    }}
                />
            }
            secondaryComponent={<OnboardingStepper currentStep={'createAccount'} tierId={tier?.id} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
