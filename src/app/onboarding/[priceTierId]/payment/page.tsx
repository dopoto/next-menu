import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import {
  PriceTierIdSchema,
  defaultTier,
  priceTiers,
} from "~/app/_domain/price-tiers";
import { CheckoutForm } from "../../_components/CheckoutForm";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import type { OnboardingStep } from "~/app/_domain/onboarding-steps";

export type Params = Promise<{ priceTierId: string }>;

export default async function OnboardingPaymentPage(props: { params: Params }) {
  const params = await props.params;
  const priceTierId = params.priceTierId;

  const parsedTier = PriceTierIdSchema.safeParse(priceTierId);
  const parsedOrDefaultTier = parsedTier.success
    ? parsedTier.data
    : defaultTier;

  const stripePriceId = priceTiers[parsedOrDefaultTier].stripePriceId ?? "";

  const mainComponent = stripePriceId ? (
    <CheckoutForm priceTierId={parsedOrDefaultTier} />
  ) : (
    // TODO
    <>Go next</>
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
      title: "Organization added",
      isActive: false,
      icon: <CompletedStepIcon />,
    },
    ...(parsedOrDefaultTier !== "start"
      ? [
          {
            id: "pay",
            title: "Pay with Stripe",
            isActive: true,
            icon: <InProgressStepIcon />,
          },
        ]
      : []),
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
