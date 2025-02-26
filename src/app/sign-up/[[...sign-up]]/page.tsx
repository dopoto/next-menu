import { SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "~/app/onboarding/_components/OnboardMultiStepper";
import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";

export default async function Page() {
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
      secondaryComponent={<OnboardMultiStepper step={1} />}
      sideHeroComponent={<SideHeroCarousel />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
