import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";

export default async function OnboardingPaymentPage() {
  const steps = getOnboardingSteps('start'); //TODO
  return (
    <SplitScreenContainer
      mainComponent={
        <>Stripe payment</>
      }
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={3} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
