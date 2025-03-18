import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../onboard/_components/OnboardingStepper";
 
/**
 
 * TODO act if user is already signed up
 * TODO act if user is already signed in
 */
export default async function SignUpErrorPage() {

  return (
    <SplitScreenContainer
      mainComponent={
        <>create account error</>
      }
      secondaryComponent={<OnboardingStepper currentStep={"create-account"} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
