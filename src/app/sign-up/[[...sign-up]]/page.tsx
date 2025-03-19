import { SignUp } from "@clerk/nextjs";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { OnboardingStepper } from "../../onboard/_components/OnboardingStepper";
import { redirect } from "next/navigation";

type SearchParams = Promise<Record<"tier", string | undefined>>;

/**
 * Users that get here should already have chosen a tier - that 
 * should be either in the search param or in a cookie.
 */
export default async function SignUpPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const tier = getValidPriceTier(searchParams.tier);

  if(!tier){
    redirect("/onboard/select-plan");
  }

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
      secondaryComponent={
        <OnboardingStepper
          currentStep={"createAccount"}
          tierId={tier?.id}
        />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
