import { SignedIn, SignedOut, SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
import {
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
import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const tier = searchParams.tier;

  const validationResult = PriceTierIdSchema.safeParse(tier);
  if (validationResult.success === false) {
    redirect("/select-plan");
  }
  const parsedTier = validationResult.data;

  const steps: OnboardingStep[] = [
    {
      id: "tier",
      title: `Chose ${priceTiers[parsedTier].name} tier`,
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
    ...(parsedTier !== "start"
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
          mainComponent={
            <SignUp
              forceRedirectUrl={`/onboarding/${parsedTier}/add-org`}
              appearance={{
                elements: {
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
            />
          }
          secondaryComponent={<MultiStepper steps={steps} />}           
          title={"Let's get you onboarded!"}
          subtitle={"This should just take a minute..."}
        ></SplitScreenContainer>
      </SignedOut>
      <SignedIn>
        <SplitScreenContainer
          mainComponent={
            <SignUp
              forceRedirectUrl={`/onboarding/${parsedTier}/add-org`}
              appearance={{
                elements: {
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
            />
          }
          secondaryComponent={null}           
          title={"Sign up"}
          subtitle={""}
        ></SplitScreenContainer>
      </SignedIn>
    </>
  );
}
