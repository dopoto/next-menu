import { APP_CONFIG } from '~/app/_config/app-config';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { SignUpPlanSelector } from '~/app/onboard/_components/SignUpPlanSelector';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Select plan`,
};

/**
 * This is the first step of signing up a user.
 * TODO act if user is already signed in
 */
export default async function SignUpSelectPlanPage() {
    return (
        <SplitScreenContainer
            mainComponent={<SignUpPlanSelector />}
            secondaryComponent={<OnboardingStepper currentStep={'selectPlan'} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
