import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { AddLocation } from "../../_components/AddLocation";
import {
  type PriceTierId,
  PriceTierIdSchema,
  defaultTier,
  priceTiers,
} from "~/app/_domain/price-tiers";
import Stripe from "stripe";
import { env } from "~/env";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
} from "~/app/_components/MultiStepper";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

export type Params = Promise<{ priceTierId: string }>;
type SearchParams = Promise<
  Record<"session_id", string | string[] | undefined>
>;

export default async function OnboardingAddLocationPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const priceTierId = params.priceTierId;
  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

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
      title: "Organization added",
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    ...(parsedOrDefaultTier !== "start"
      ? [
          {
            id: "pay",
            title: "Payment completed",
            isActive: false,
            icon: <CompletedStepIcon />,
          },
        ]
      : []),
    {
      id: "addloc",
      title: "Set up a location",
      isActive: true,
      icon: <InProgressStepIcon />,
    },
  ];

  let mainComponent;

  if (parsedOrDefaultTier === "start") {
    mainComponent = <AddLocation priceTierId="start" />;
  } else {
    // If we are on a non-free onboarding, we need to ensure that the payment
    // has been completed successfully before showing an Add Location form here.
    const searchParams = await props.searchParams;
    const stripeSessionId = searchParams.session_id?.toString() ?? "";
    mainComponent = await getMainComponent(
      stripeSessionId,
      parsedOrDefaultTier,
    );
  }

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      secondaryComponent={<MultiStepper steps={steps} />}
      title={"Let's get you onboarded!"}
      subtitle={"One last thing..."}
    ></SplitScreenContainer>
  );
}

const getMainComponent = async (
  stripeSessionId: string,
  tierId: PriceTierId,
) => {
  let mainComponent;
  if (stripeSessionId?.length === 0) {
    // TODO log error
    mainComponent = (
      <>
        TODO Throw instead
        {/* <BoxError
        errorTypeId="STRIPE_MISSING_PAYMENT_DATA"
        dynamicCtas={[
          <Link key="retry" href={`/onboarding/${tierId}/payment`}>
            <Button variant="outline">Retry payment</Button>
          </Link>,
        ]}
      /> */}
      </>
    );
  } else {
    let sessionStatus: string | null = "";
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      sessionStatus = session.status;
      switch (sessionStatus) {
        case "complete":
          mainComponent = (
            <AddLocation
              priceTierId={tierId}
              stripeSessionId={stripeSessionId}
            />
          );
          break;
        case "expired":
          // TODO log error
          mainComponent = (
            <>
              TODO Throw instead
              {/*             <BoxError
              errorTypeId="STRIPE_PAYMENT_EXPIRED"
              dynamicCtas={[
                <Link key="retry" href={`/onboarding/${tierId}/payment`}>
                  <Button variant="outline">Retry payment</Button>
                </Link>,
              ]}
            /> */}
            </>
          );
          break;
        case "open":
          mainComponent = <>open</>;
          break;
        default:
          // TODO log error
          mainComponent = (
            <>
              TODO Throw instead
              {/*             <BoxError
              errorTypeId="STRIPE_PAYMENT_UNKNOWN_STATUS"
              context={{ status: sessionStatus ?? "" }}
              dynamicCtas={[
                <Link key="retry" href={`/onboarding/${tierId}/payment`}>
                  <Button variant="outline">Retry payment</Button>
                </Link>,
              ]}
            /> */}
            </>
          );
          break;
      }
    } catch {
      mainComponent = (
        <>
          TODO Throw instead
          {/*                     <BoxError
          errorTypeId="STRIPE_PAYMENT_EXPIRED"
          dynamicCtas={[
            <Link key="retry" href={`/onboarding/${tierId}/payment`}>
              <Button variant="outline">Retry payment</Button>
            </Link>,
          ]}
        /> */}
        </>
      );
    }
  }

  return mainComponent;
};
