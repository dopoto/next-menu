import { ReactNode } from "react";
import {
  CompletedStepIcon,
  InProgressStepIcon,
  MultiStepper,
  UncompletedStepIcon,
} from "~/app/_components/MultiStepper";
import { PriceTierId, priceTiers } from "~/app/_domain/price-tiers";

export type OnboardingStepperStep =
  | "select-plan"
  | "create-account"
  | "add-org"
  | "pay"
  | "add-location"
  | 'review';

export type OnboardingStep = {
  id: OnboardingStepperStep;
  isActive: boolean;
  icon: ReactNode;
  title: string | ReactNode;
};

const getStepIcon = (
  step: OnboardingStepperStep,
  currentStep: OnboardingStepperStep,
) => {
  if(step === currentStep){
    return <InProgressStepIcon />;
  }

  if(step === 'select-plan'){
    return <CompletedStepIcon />;
  }

  if(step === 'create-account'){
    if(currentStep === 'pay' || currentStep === 'add-org' || currentStep === 'add-location'){
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  if(step === 'add-org'){
    if(currentStep === 'pay' || currentStep === 'add-location'){
      return <CompletedStepIcon />;
    }
    return <UncompletedStepIcon />;
  }

  return <UncompletedStepIcon />;
};

export async function OnboardingStepper(props: {
  tierId?: PriceTierId;
  currentStep: OnboardingStepperStep;
}) {
  //   const tierStepTitle = parsedTier
  //   ? `Chose the ${priceTiers[parsedTier].name} plan ($${priceTiers[parsedTier].monthlyUsdPrice.toFixed(2)}/month)`
  //   : "Select a plan";
  // const tierStepIsActive = parsedTier ? false : true;
  // const tierStepIcon = parsedTier ? <CompletedStepIcon /> : <InProgressStepIcon />;

  // const signUpStepIsActive = parsedTier ? true: false;
  // const signUpStepIcon = parsedTier ? <InProgressStepIcon /> :<UncompletedStepIcon /> ;

  const steps: OnboardingStep[] = [
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
      title: "Create account",
      isActive: props.currentStep === "create-account",
      icon: getStepIcon("create-account", props.currentStep),
    },
    {
      id: "add-org",
      title: "Create your organization",
      isActive: props.currentStep === "add-org",
      icon: getStepIcon("add-org", props.currentStep),
    },
    // ...(getValidPaidPriceTier(props.tierId)  ?
    //   [
    //       {
    //         id: "pay",
    //         title: "Pay with Stripe",
    //         isActive: false,
    //         icon: <UncompletedStepIcon />,
    //       },
    //     ]
    //   : []),
    {
      id: "add-location",
      title: "Create a location",
      isActive: false,
      icon: <UncompletedStepIcon />,
    },
    {
      id: "review",
      title: "Onboarding overview",
      isActive: false,
      icon: <UncompletedStepIcon />,
    },
  ];

  return (
    <MultiStepper steps={steps} />
  );
}
