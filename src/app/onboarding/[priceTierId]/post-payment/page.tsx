import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardMultiStepper } from "../../_components/OnboardMultiStepper";
import { getOnboardingSteps } from "~/app/_utils/onboarding-utils";
import {
  PriceTierIdSchema,
  defaultTier,
  priceTiers,
} from "~/app/_domain/price-tiers";
import { CheckoutForm } from "../../_components/CheckoutForm";
import { env } from "~/env";
import Stripe from "stripe";
import { PostPayment } from "../../_components/PostPayment";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

export type Params = Promise<{ priceTierId: string }>;
type SearchParams = Promise<
  Record<"session_id", string | string[] | undefined>
>;

export default async function OnboardingPaymentPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  // Get the status of the Stripe payment
  let stripePaymentStatus: Stripe.Checkout.Session.Status | "error" | null =
    null;
  const searchParams = await props.searchParams;
  const stripeSessionId = searchParams.session_id?.toString() ?? "";
  if (!stripeSessionId?.length) {
    stripePaymentStatus = "error";
  }
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
  stripePaymentStatus = session.status;

  const params = await props.params;
  const priceTierId = params.priceTierId;

  // TODO Revisit
  // const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  // const parsedOrDefaultTier = parsedTier.success
  //   ? parsedTier.data
  //   : defaultTier;
  // const stripePriceId = priceTiers[parsedOrDefaultTier].stripePriceId ?? "";

  const mainComponent = <PostPayment stripeSession={session} />
  
  const steps = [
    { title: "Signed up" },
    { title: "Added organization" },
    { title: `Payment ${stripePaymentStatus}` },
    { title: "Set up a location" },
  ];

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      secondaryComponent={<OnboardMultiStepper steps={steps} currentStep={3} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
