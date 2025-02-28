import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";
import { PriceTierIdSchema, defaultTier } from "~/app/_domain/price-tiers";
import Link from "next/link";

export type Params = Promise<{ priceTierId: string }>;

export default async function OnboardingPaymentPage(props: { params: Params }) {

  const params = await props.params;   
  const priceTierId = params.priceTierId;

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  // TODO handle free? should not happen

  const steps = getOnboardingSteps(parsedOrDefaultTier);
  
  return (
    <SplitScreenContainer
      mainComponent={
        <>Stripe payment <Link href={`/onboarding/${parsedOrDefaultTier}/add-location`}>Add location</Link></>
      }
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={3} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
