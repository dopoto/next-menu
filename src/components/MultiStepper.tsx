import { type ReactNode } from 'react';

export type Step = {
    id: string;
    status: 'completed' | 'active' | 'pending';
    icon: ReactNode;
    title: string | ReactNode;
};

export function MultiStepper(props: { steps: Array<Step> }) {
    return (
        <div className="grid max-w-2xl">
            {props.steps.map((step, index) => (
                <MultistepperStep
                    key={step.id}
                    step={step}
                    isFirst={index === 0}
                    isLast={index === props.steps.length - 1}
                />
            ))}
        </div>
    );
}

const MultistepperStep = (props: { step: Step; isFirst: boolean; isLast: boolean }) => {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                {props.step.icon}
                {!props.isLast && <div className={`h-full border border-gray-300 transition-all duration-300`} />}
            </div>
            <div>
                <h3
                    className={`mt-1 pb-3 text-sm text-gray-800 dark:text-gray-100 ${props.step.status === 'active' ? 'font-medium' : 'font-light'} `}
                >
                    {props.step.title}
                </h3>
            </div>
        </div>
    );
};

export const InProgressStepIcon = () => (
    <div className={`animate-pulse rounded-full bg-gray-300`}>
        <div className={`m-1 size-6 rounded-full border-8 border-black transition-all duration-300`} />
    </div>
);

export const UncompletedStepIcon = () => (
    <div className={`rounded-full bg-transparent`}>
        <div className={`m-1 size-6 rounded-full border-8 border-gray-300 transition-all duration-300`} />
    </div>
);

export const CompletedStepIcon = () => (
    <div className={`rounded-full bg-transparent`}>
        <div className="m-1 flex size-6 items-center justify-center rounded-full bg-green-800">
            <CheckSVG />
        </div>
    </div>
);

export const CheckSVG = () => (
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.0964 0.390037L3.93638 7.30004L2.03638 5.27004C1.68638 4.94004 1.13638 4.92004 0.736381 5.20004C0.346381 5.49004 0.236381 6.00004 0.476381 6.41004L2.72638 10.07C2.94638 10.41 3.32638 10.62 3.75638 10.62C4.16638 10.62 4.55638 10.41 4.77638 10.07C5.13638 9.60004 12.0064 1.41004 12.0064 1.41004C12.9064 0.490037 11.8164 -0.319963 11.0964 0.380037V0.390037Z"
            fill="white"
        />
    </svg>
);
