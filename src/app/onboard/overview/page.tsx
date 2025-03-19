import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { Overview } from "../_components/Overview";
import { env } from "~/env";
import Stripe from "stripe";
import { type PublicStripeSubscriptionDetails, type StripeCustomerId } from "~/app/_domain/stripe";
import { getActiveStripeSubscription } from "~/app/_utils/stripe-utils";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

type SearchParams = Promise<
  Record<"session_id", string | string[] | undefined>
>;

export default async function OverviewPage(props: {
  searchParams: SearchParams;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/sign-up");
  }

  const priceTierId = sessionClaims?.metadata?.tier;
  const parsedTier = getValidPriceTier(priceTierId);

  if (!parsedTier) {
    redirect("/onboard/select-plan");
  }
  const parsedTierId = parsedTier.id;

  // Get the status of the Stripe payment
  const searchParams = await props.searchParams;
  const stripeSessionId = searchParams.session_id?.toString() ?? "";
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["customer"],
  });
  const stripeCustomer = session.customer as Stripe.Customer;
  const stripeCustomerId   = stripeCustomer.id as StripeCustomerId;
  const stripeSub = await getActiveStripeSubscription(stripeCustomerId)
  const publicStripeSubscriptionDetails: PublicStripeSubscriptionDetails = {
    id: stripeSub?.id,
    current_period_end: stripeSub?.current_period_end,
  };

  return (
    <SplitScreenContainer
      mainComponent={
        <Overview
          claims={sessionClaims}
          publicStripeSubscriptionDetails={publicStripeSubscriptionDetails}
        />
      }
      secondaryComponent={
        <OnboardingStepper currentStep={"overview"} tierId={parsedTierId} />
      }
      title={"Welcome!"}
      subtitle={"Your onboarding is now completed"}
    ></SplitScreenContainer>
  );
}
