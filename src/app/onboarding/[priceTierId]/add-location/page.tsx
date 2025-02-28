import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { AddLocation } from "../../_components/AddLocation";
import { OnboardMultiStepper } from "../../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";
import { PriceTierIdSchema, defaultTier } from "~/app/_domain/price-tiers";

export type Params = Promise<{ priceTierId: string }>;

export default async function OnboardingAddLocationPage(props: {
  params: Params;
}) {
  const params = await props.params;
  //TODO Once Stripe is implemented, replace this with reading the tier from the token
  const priceTierId = params.priceTierId; 

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const steps = getOnboardingSteps(parsedOrDefaultTier);
  const currentStep = parsedOrDefaultTier === "start" ? 3 : 4;

  return (
    <SplitScreenContainer
      mainComponent={<AddLocation />}
      secondaryComponent={
        <OnboardMultiStepper steps={steps} currentStep={currentStep} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"One last thing..."}
    ></SplitScreenContainer>
  );
}
