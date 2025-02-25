import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { AddLocation } from "../_components/AddLocation";
import { OnboardMultiStepper } from "../_components/OnboardMultiStepper";

export default async function OnboardingPage() {
  return (
    <SplitScreenContainer
      mainComponent={<AddLocation />}
      secondaryComponent={<OnboardMultiStepper step={3} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
