import { SignedIn, SignedOut, SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
import {
  defaultTier,
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
import { PlanSelector } from "../_components/PlanSelector";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpSelectPlanPage(props: {
  searchParams: SearchParams;
}) {
  const steps: OnboardingStep[] = [
    {
      id: "tier",
      title: `Select a plan`,
      isActive: true,
      icon: <CompletedStepIcon />,
    },
    {
      id: "signup",
      title: "Sign up",
      isActive: false,
      icon: <InProgressStepIcon />,
    },
    {
      id: "addorg",
      title: "Add organization",
      isActive: false,
      icon: <UncompletedStepIcon />,
    },
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
          mainComponent={<PlanSelector />}
          secondaryComponent={<MultiStepper steps={steps} />}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Let's get you onboarded!"}
          subtitle={"This should just take a minute..."}
        ></SplitScreenContainer>
      </SignedOut>
      <SignedIn>
        <SplitScreenContainer
          mainComponent={<>signed in. TODO</>}
          secondaryComponent={null}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Sign up"}
          subtitle={""}
        ></SplitScreenContainer>
      </SignedIn>
    </>
  );
}
