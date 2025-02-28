/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CreateOrganization,
  OrganizationList,
  OrganizationProfile,
} from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";
import { PriceTierIdSchema, defaultTier } from "~/app/_domain/price-tiers";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Card } from "~/components/ui/card";

export type Params = Promise<{ priceTierId: string }>;

export default async function OnboardingAddOrgPage(props: { params: Params }) {

  const params = await props.params;   
  const priceTierId = params.priceTierId;

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const steps = getOnboardingSteps(parsedOrDefaultTier);

  const nextStep =
    parsedOrDefaultTier === "start"
      ? `/onboarding/${parsedOrDefaultTier}/add-location`
      : `/onboarding/${parsedOrDefaultTier}/payment`;

  const { orgId } = await auth();
  const client = await clerkClient();
  let orgName = "";
  if (orgId) {
    const organization = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    orgName = organization.name;
  }

  // Users might go back and forth in browser, so don't show Create Org if
  // they already have an org.
  const mainComponent = orgId ? (
    <Card>Org name: {orgName}</Card>
  ) : (
    <CreateOrganization
      afterCreateOrganizationUrl={nextStep}
      skipInvitationScreen={true}
      hideSlug={true}
    />
  );

  return (
    <SplitScreenContainer
      title={"Let's get you onboarded!"}
      subtitle={"Getting there..."}
      mainComponent={mainComponent}
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={2} />}
    ></SplitScreenContainer>
  );
}
