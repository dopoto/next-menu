import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  Step,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import { PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { getValidPaidPriceTier } from "~/app/_utils/price-tier-utils";

export type OnboardingStepperStep =
  | "select-plan"
  | "create-account"
  | "add-org"
  | "pay"
  | "add-location"
  | "overview";

const getStepIcon = (
  step: OnboardingStepperStep,
  currentStep: OnboardingStepperStep,
) => {

  if (step === currentStep) {
    return <InProgressStepIcon />;
  }

  if (step === "select-plan") {
    return <CompletedStepIcon />;
  }

  if (step === "create-account") {
    if (
      currentStep === "add-org" ||
      currentStep === "pay" ||
      currentStep === "add-location" ||
      currentStep === "overview"
    ) {
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  if (step === "add-org") {
    if (
      currentStep === "pay" ||
      currentStep === "add-location" ||
      currentStep === "overview"
    ) {
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  if (step === "pay") {
    if (
      currentStep === "add-location" ||
      currentStep === "overview"
    ) {
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  if (step === "add-location") {
    if (currentStep === "overview") {
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  if (currentStep === "overview") {
    return <CompletedStepIcon />;
  }

  return <UncompletedStepIcon />;
};

export async function OnboardingStepper(props: {
  tierId?: PriceTierId;
  currentStep: OnboardingStepperStep;
}) {
  const steps: Step[] = [
    {
      id: "select-plan",
      title: props.tierId
        ? `Chose the ${priceTiers[props.tierId].name} plan ($${priceTiers[props.tierId].monthlyUsdPrice.toFixed(2)}/month)`
        : "Select a plan",
      isActive: props.currentStep === "select-plan",
      icon: getStepIcon("select-plan", props.currentStep),
    },
    {
      id: "create-account",
      title:
        props.currentStep === "select-plan" ||
        props.currentStep === "create-account"
          ? "Sign up"
          : "Signed up",
      isActive: props.currentStep === "create-account",
      icon: getStepIcon("create-account", props.currentStep),
    },
    {
      id: "add-org",
      title: "Create your organization",
      isActive: props.currentStep === "add-org",
      icon: getStepIcon("add-org", props.currentStep),
    },
    ...(getValidPaidPriceTier(props.tierId)  ?
      [
          {
            id: "pay",
            title: "Pay with Stripe",
            isActive: false,
            icon: <UncompletedStepIcon />,
          },
        ]
      : []),
    {
      id: "add-location",
      title: "Create a location",
      isActive: props.currentStep === "add-location",
      icon: getStepIcon("add-location", props.currentStep),
    },
    {
      id: "overview",
      title: "Onboarding overview",
      isActive: props.currentStep === "overview",
      icon: getStepIcon("overview", props.currentStep),
    },
  ];

  return <MultiStepper steps={steps} />;
}
