import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { env } from "~/env";
import { updateCustomerByClerkUserId } from "~/server/queries";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { Redirecting } from "../_components/PostPayment";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CookieKey } from "~/app/_domain/cookies";
import { getValidPaidPriceTier } from "~/app/_utils/price-tier-utils";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

type SearchParams = Promise<
  Record<"session_id", string | string[] | undefined>
>;

export default async function OnboardPostPaymentPage(props: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
  const parsedTier = getValidPaidPriceTier(tier);
  if (!parsedTier) {
    redirect("/onboard/select-plan");
  }
  
  // Get the status of the Stripe payment
  const searchParams = await props.searchParams;
  const stripeSessionId = searchParams.session_id?.toString() ?? "";
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["customer"],
  });
  const stripeCustomer = session.customer as Stripe.Customer;
  const { userId } = await auth();

  const isValidPayment = session.status === "complete" &&
    stripeCustomer &&
    "id" in stripeCustomer && userId;

    if(isValidPayment){
        await updateCustomerByClerkUserId(userId, stripeCustomer.id);
    }
    else {
      throw new Error(`Stripe - not a valid payment. Payment status: ${session.status}| userId: ${userId}| stripeCustomer: ${JSON.stringify(stripeCustomer)}`);
    }

  return (
    <SplitScreenContainer
      mainComponent={
        <Redirecting stripeSessionId={session.id} />
      }
      secondaryComponent={
        <OnboardingStepper currentStep={"pay"} tierId={parsedTier.id} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
