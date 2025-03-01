/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CreateOrganization,
} from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
 
import { PriceTierIdSchema, defaultTier } from "~/app/_domain/price-tiers";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Card } from "~/components/ui/card";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";

export type Params = Promise<{ priceTierId: string }>;

export default async function OnboardingAddOrgPage(props: { params: Params }) {
  const params = await props.params;
  const priceTierId = params.priceTierId;

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const steps: OnboardingStep[] = [
    {
      id: "signup",
      title: "Sign up completed",
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    {
      id: "addorg",
      title: "Add organization",
      isActive: true,
      icon: <InProgressStepIcon />
    },
    ...(parsedOrDefaultTier !== "start"
      ? [
          {
            id: "pay",
            title: "Pay with Stripe",
            isActive: false,
            icon: <UncompletedStepIcon />,
          },
        ]
      : []),
    {
      id: "addloc",
      title: "Set up a location",
      isActive: false,
      icon: <UncompletedStepIcon />,
    },
  ];

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
      secondaryComponent={<MultiStepper steps={steps} />}
    ></SplitScreenContainer>
  );
}
