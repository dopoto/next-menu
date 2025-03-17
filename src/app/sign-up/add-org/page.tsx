import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
 
/**
 
 * TODO act if user is already signed up
 * TODO act if user is already signed in
 */
export default async function AddOrgPlanPage() {

  return (
    <SplitScreenContainer
      mainComponent={
        <>add org</>
      }
      secondaryComponent={<OnboardingStepper currentStep={"add-org"} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
