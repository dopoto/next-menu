import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { AddLocation } from "../../_components/AddLocation";
import { OnboardMultiStepper } from "../../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";
import { PriceTierIdSchema, defaultTier } from "~/app/_domain/price-tiers";
import Stripe from "stripe";
import { env } from "~/env";

const stripeApiKey =  env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

export type Params = Promise<{ priceTierId: string }>;
type SearchParams = Promise<Record<"session_id", string | string[] | undefined>>;

export default async function OnboardingAddLocationPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {

  // Get the status of the Stripe payment
  let stripePaymentStatus: Stripe.Checkout.Session.Status | 'error' | null = null;
  const searchParams = await props.searchParams;
  const stripeSessionId  = searchParams.session_id?.toString() ?? '';
  if (!stripeSessionId?.length){
    stripePaymentStatus = 'error';
  }
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
  stripePaymentStatus = session.status
  

  const params = await props.params;
  //TODO Once Stripe is implemented, replace this with reading the tier from the token
  const priceTierId = params.priceTierId; 

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const steps = [
    { title: "Sign up" },
    { title: "Add organization" },
    { title: `Payment ${stripePaymentStatus}` },
    { title: "Set up a location" },
  ]
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
