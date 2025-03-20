import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { CreateOrganization } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CookieKey } from "~/app/_domain/cookies";
import {
  getValidPriceTier,
  isFreePriceTier,
} from "~/app/_utils/price-tier-utils";
import { OrgCreated } from "../_components/OrgCreated";
import * as React from "react";
import { ROUTES, ApplicationRoute } from "~/app/_domain/routes";

export const dynamic = "force-dynamic";

export default async function AddOrgPlanPage() {
  const { userId, orgId } = await auth();
  if (!userId) {
    redirect(ROUTES.signIn);
  }

  const cookieStore = cookies();
  const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
  const parsedTier = getValidPriceTier(tier);

  if (!parsedTier) {
    redirect(ROUTES.onboardSelectPlan);
  }
  const nextStep: ApplicationRoute = isFreePriceTier(parsedTier.id)
    ? ROUTES.onboardAddLocation
    : ROUTES.onboardPayment

  const mainComponent = orgId ? (
    <OrgCreated nextStepRoute={nextStep} />
  ) : (
    <CreateOrganization
      afterCreateOrganizationUrl={nextStep}
      skipInvitationScreen={true}
      hideSlug={true}
    />
  );

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      secondaryComponent={
        <OnboardingStepper currentStep={"addOrg"} tierId={parsedTier.id} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
