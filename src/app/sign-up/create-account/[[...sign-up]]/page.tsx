import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { priceTiers } from "~/app/_domain/price-tiers";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { OnboardingStepper } from "../../_components/OnboardingStepper";

type SearchParams = Promise<Record<"tier", string | undefined>>;

/**
 * Users that get here should already have chosen a tier - that should be
 * either in the search param or in a cookie.
 * TODO act if user is already signed up
 * TODO act if user is already signed in
 */
export default async function SignUpCreateAccountPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const searchParamValidTier = getValidPriceTier(searchParams.tier);

  if (!searchParamValidTier) {
    console.log("No valid tier in search param. try cookie");
    redirect("/select-plan")
    // get from cookie
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
      secondaryComponent={<OnboardingStepper currentStep={"create-account"} tierId={searchParamValidTier.id}   />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
