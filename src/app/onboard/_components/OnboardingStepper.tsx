import { type ReactNode } from 'react';
import {
    CompletedStepIcon,
    InProgressStepIcon,
    MultiStepper,
    type Step,
    UncompletedStepIcon,
} from '~/app/_components/MultiStepper';
import { type PriceTierId, priceTiers } from '~/domain/price-tiers';
import { isPaidPriceTier } from '~/lib/price-tier-utils';

export type OnboardingStepId = 'selectPlan' | 'createAccount' | 'addOrg' | 'pay' | 'addLocation' | 'overview';

type OnboardingContext = { tierId?: PriceTierId };

const onboardingSteps: Record<
    OnboardingStepId,
    {
        orderIndex: number;
        title: string;
        completedTitleFn: (context: OnboardingContext) => string | ReactNode;
    }
> = {
    selectPlan: {
        orderIndex: 1,
        title: 'Select a plan',
        completedTitleFn: (context) => {
            if (!context?.tierId) {
                return null;
            }
            const priceTier = priceTiers[context.tierId];
            return `Chose the ${priceTier.name} plan ($${priceTier.monthlyUsdPrice.toFixed(2)}/month)`;
        },
    },
    createAccount: {
        orderIndex: 2,
        title: 'Create an account',
        completedTitleFn: () => 'Created an account',
    },
    addOrg: {
        orderIndex: 3,
        title: 'Add an organization',
        completedTitleFn: () => 'Added an organization',
    },
    pay: {
        orderIndex: 4,
        title: 'Pay with Stripe',
        completedTitleFn: () => 'Completed payment with Stripe',
    },
    addLocation: {
        orderIndex: 5,
        title: 'Add a location',
        completedTitleFn: () => 'Added a location',
    },
    overview: {
        orderIndex: 6,
        title: 'Overview',
        completedTitleFn: () => 'Overview',
    },
};

export async function OnboardingStepper(props: { tierId?: PriceTierId; currentStep: OnboardingStepId }) {
    const isPaidTier = props?.tierId && isPaidPriceTier(props?.tierId);
    const currentStepIndex = onboardingSteps[props.currentStep].orderIndex;
    const steps: Step[] = Object.keys(onboardingSteps)
        .filter((stepId) => {
            if (!isPaidTier && stepId === 'pay') {
                return false;
            }
            return true;
        })
        .map((stepId) => {
            const step = onboardingSteps[stepId as OnboardingStepId];
            const stepStatus: Step['status'] =
                step.orderIndex < currentStepIndex
                    ? 'completed'
                    : step.orderIndex === currentStepIndex
                      ? 'active'
                      : 'pending';
            const context: OnboardingContext = { tierId: props.tierId };
            return {
                id: stepId,
                title: stepStatus === 'completed' ? step.completedTitleFn(context) : step.title,
                status: stepStatus,
                icon:
                    stepStatus === 'completed' ? (
                        <CompletedStepIcon />
                    ) : stepStatus === 'active' ? (
                        <InProgressStepIcon />
                    ) : (
                        <UncompletedStepIcon />
                    ),
            };
        });

    return <MultiStepper steps={steps} />;
}
