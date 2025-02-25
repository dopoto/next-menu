import { CreateOrganization } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../_components/OnboardMultiStepper";

export default async function OnboardingPage() {
  return (
    <SplitScreenContainer
      mainComponent={
        <CreateOrganization
          afterCreateOrganizationUrl={"/onboarding/step-2-add-location"}
          skipInvitationScreen={true}
          hideSlug={true}
        />
      }
      secondaryComponent={<OnboardMultiStepper step={2} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
