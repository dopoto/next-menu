import { SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "~/app/onboarding/_components/OnboardMultiStepper";

export default async function Page() {
  return (
    <SplitScreenContainer
      mainComponent={<SignUp />}
      secondaryComponent={<OnboardMultiStepper step={1} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
