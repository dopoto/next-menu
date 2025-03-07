import { SignedIn, SignedOut, SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
import {
  defaultTier,
  type PriceTierId,
  PriceTierIdSchema,
  priceTiers,
} from "~/app/_domain/price-tiers";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { BoxWarning } from "~/app/_components/BoxWarning";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const tier = searchParams.tier;

  const parsedTier = PriceTierIdSchema.safeParse(tier);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const steps: OnboardingStep[] = [
    {
      id: "tier",
      title: `Chose ${priceTiers[parsedOrDefaultTier].name} tier`,
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    {
      id: "signup",
      title: "Sign up",
      isActive: true,
      icon: <InProgressStepIcon />,
    },
    {
      id: "addorg",
      title: "Add organization",
      isActive: false,
      icon: <UncompletedStepIcon />,
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

  return (
    <>
      <SignedOut>
        <SplitScreenContainer
          mainComponent={getSignUpMainComponent(parsedOrDefaultTier)}
          secondaryComponent={<MultiStepper steps={steps} />}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Let's get you onboarded!"}
          subtitle={"This should just take a minute..."}
        ></SplitScreenContainer>
      </SignedOut>
      <SignedIn>
        <SplitScreenContainer
          mainComponent={getSignedInMainComponent()}
          secondaryComponent={null}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Sign up"}
          subtitle={""}
        ></SplitScreenContainer>
      </SignedIn>
    </>
  );
}

const getSignUpMainComponent = async (tier: PriceTierId) => {
  return (
    <SignUp    
      fallbackRedirectUrl={`/onboarding/${tier}/add-org`}
      appearance={{
        elements: {
          headerTitle: "hidden",
          headerSubtitle: "hidden",
        },
      }}
    />
  );
};

const getSignedInMainComponent = async () => {
  const hasOnboarded = (await auth()).sessionClaims?.metadata
    ?.onboardingComplete;

  if (hasOnboarded === true) {
    return (
      <BoxWarning
        title={"You have already signed up"}
        ctas={[
          <Link key="retry" href={`/my`}>
            <Button variant="outline">My dashboard</Button>
          </Link>,
        ]}
      />
    );
  } else {
    return getSignUpMainComponent(defaultTier);
  }
};
