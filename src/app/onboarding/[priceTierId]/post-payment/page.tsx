import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { env } from "~/env";
import Stripe from "stripe";
import { PostPayment } from "../../_components/PostPayment";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
import {
  PriceTierIdSchema,
  defaultTier,
  priceTiers,
} from "~/app/_domain/price-tiers";

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
  const searchParams = await props.searchParams;
  const stripeSessionId = searchParams.session_id?.toString() ?? "";
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

  const params = await props.params;
  const priceTierId = params.priceTierId;
  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const mainComponent = (
    <PostPayment stripeSession={session} tierId={parsedOrDefaultTier} />
  );

  const steps: OnboardingStep[] = [
    {
      id: "tier",
      title: `Chose ${priceTiers[parsedOrDefaultTier].name} tier`,
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    {
      id: "signup",
      title: "Sign up completed",
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    {
      id: "addorg",
      icon: <CompletedStepIcon />,
      title: "Added organization",
      isActive: false,
    },
    {
      id: "pay",
      title: "Pay with Stripe",
      isActive: true,
      icon: <InProgressStepIcon />,
    },
    {
      id: "addloc",
      title: "Set up a location",
      isActive: false,
      icon: <UncompletedStepIcon />,
    },
  ];

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      secondaryComponent={<MultiStepper steps={steps} />}
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
