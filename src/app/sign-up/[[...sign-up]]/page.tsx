import { SignedIn, SignedOut, SignOutButton, SignUp, UserButton } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
import { defaultTier, PriceTierIdSchema } from "~/app/_domain/price-tiers";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
import {
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
          mainComponent={
            <>
              <SignUp
                fallbackRedirectUrl={`/onboarding/${parsedOrDefaultTier}/add-org`}
                appearance={{
                  elements: {
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
              />
            </>
          }
          secondaryComponent={<MultiStepper steps={steps} />}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Let's get you onboarded!"}
          subtitle={"This should just take a minute..."}
        ></SplitScreenContainer>
      </SignedOut>
      <SignedIn>
        <SplitScreenContainer
          mainComponent={
            <Card className="bg-amber-200">
              <CardHeader>
                <h1>{`You're already signed up`}</h1>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2">
                 <Link className="w-full" href='/my'><Button className="w-full">Take me to my dashboard</Button></Link> 
                 <SignOutButton><Button className="w-full" variant={'secondary'}>Sign out</Button></SignOutButton> 
              </CardFooter>
            </Card>
          }
          secondaryComponent={null}
          sideHeroComponent={<SideHeroCarousel />}
          title={"Sign up"}
          subtitle={''}
        ></SplitScreenContainer>
      </SignedIn>
    </>
  );
}
