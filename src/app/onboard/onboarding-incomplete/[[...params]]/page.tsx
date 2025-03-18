import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../../_components/OnboardingStepper";
 
export default async function OnboardingIncompletePage() {

  return (
    <SplitScreenContainer
      mainComponent={
        <>onboarding-incomplete</>
      }
      secondaryComponent={<OnboardingStepper currentStep={"add-org"} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
