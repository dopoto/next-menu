import * as React from "react";
import { CreateOrganization } from "@clerk/nextjs";
import { SplitScreenOnboard } from "~/app/_components/SplitScreenOnboard";

export default async function OnboardingPage() {
  return (
    <SplitScreenOnboard
      step={2}
      mainComponent={
        <CreateOrganization
          afterCreateOrganizationUrl={"/onboarding/step-2-add-location"}
          skipInvitationScreen={true}
          hideSlug={true}
        />
      }
    ></SplitScreenOnboard>
  );
}
