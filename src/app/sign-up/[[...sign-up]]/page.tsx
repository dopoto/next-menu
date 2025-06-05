import { SignUp } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { APP_CONFIG } from '~/config/app-config';
import { CookieKey } from '~/domain/cookies';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

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
    const cookieStore = cookies();
    const tier =
        getValidPriceTier(searchParams.tier) ??
        getValidPriceTier((await cookieStore).get(CookieKey.OnboardPlan)?.value);

    if (!tier) {
        redirect(ROUTES.onboardSelectPlan);
    }

    return (
        <SplitScreenContainer
            showSignInLink={true}
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
