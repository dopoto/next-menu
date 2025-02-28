import { SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "~/app/onboarding/_components/OnboardMultiStepper";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
import { defaultTier, PriceTierIdSchema } from "~/app/_domain/price-tiers";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";

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

  const steps = getOnboardingSteps(parsedOrDefaultTier);

  return (
    <SplitScreenContainer
      mainComponent={
        <SignUp
          appearance={{
            elements: {
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      }
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={1} />}
      sideHeroComponent={<SideHeroCarousel />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
