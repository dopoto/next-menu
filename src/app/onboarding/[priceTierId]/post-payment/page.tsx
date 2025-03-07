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
import { updateCustomerByClerkUserId } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

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
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["customer"],
  });
  const stripeCustomer = session.customer as Stripe.Customer;
  if (
    session.status === "complete" &&
    stripeCustomer &&
    "id" in stripeCustomer
  ) {
    console.log(`DBG stripeCustomer ${JSON.stringify(stripeCustomer)}`);
    const { userId } = await auth();
    if (userId) {
      const upd = await updateCustomerByClerkUserId(userId, stripeCustomer.id);
      console.log(`DBG updated user ${JSON.stringify(upd)}`);
    } else {
      //TODO Handle error
    }

  }

  /*
{"id":"cus_RtjpUYewkTRFWr","object":"customer","address":{"city":null,"country":"RO","line1":null,"line2":null,"postal_code":null,"state":null},"balance":0,"created":1741336434,"currency":"usd","default_source":null,"delinquent":false,"description":null,"discount":null,"email":"dopoto@gmail.com","invoice_prefix":"A6333088","invoice_settings":{"custom_fields":null,"default_payment_method":null,"footer":null,"rendering_options":null},"livemode":false,"metadata":{},"name":"D R","phone":null,"preferred_locales":["en-US"],"shipping":null,"tax_exempt":"none","test_clock":null}
*/

  // if (stripeCustomerId) {
  //   // Store the Stripe Customer ID in your database here
  //   await storeStripeCustomerIdInDatabase(stripeCustomerId);
  // } else {
  //   console.error("No customer ID found in the session.");
  // }

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
