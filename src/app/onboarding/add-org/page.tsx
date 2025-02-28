import { CreateOrganization } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";

export default async function OnboardingAddOrgPage() {
  const steps = getOnboardingSteps("start"); //TODO

  return (
    <SplitScreenContainer
      mainComponent={
        <CreateOrganization
          afterCreateOrganizationUrl={"/onboarding/step-2-add-location"}
          skipInvitationScreen={true}
          hideSlug={true}
        />
      }
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={2} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
