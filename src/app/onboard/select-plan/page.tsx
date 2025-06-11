import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { SignUpPlanSelector } from '~/app/onboard/_components/SignUpPlanSelector';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { APP_CONFIG } from '~/config/app-config';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Select plan`,
};

/**
 * This is the first step of signing up a user.
 */
export default async function SignUpSelectPlanPage() {
    return (
        <SplitScreenContainer
            showSignInLink={true}
            mainComponent={<SignUpPlanSelector />}
            secondaryComponent={<OnboardingStepper currentStep={'selectPlan'} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
