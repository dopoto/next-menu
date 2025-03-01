export function MultiStepper(props: {
  steps: Array<{ title: string; subtitle?: string }>;
  currentStep: number;
}) {
  return (
    <div className="mx-auto grid max-w-2xl">
      {props.steps.map((step, index) => (
        <Step
          key={step.title}
          stepNumber={index + 1}
          title={step.title}
          isFirst={index === 0}
          isLast={index === props.steps.length - 1}
          isActive={index < props.currentStep}
          isCompleted={index < props.currentStep - 1}
        />
      ))}
    </div>
  );
}

const Step = (props: {
  title: string;
  subtitle?: string;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`${props.isActive ? "bg-gray-300" : "bg-transparent"} rounded-full`}
        >
          {props.isCompleted ? (
            <div className="m-1 flex size-6 items-center justify-center rounded-full bg-black">
              <CheckSVG />
            </div>
          ) : (
            <div
              className={`size-6 rounded-full border-8 ${props.isActive ? "border-black" : "border-gray-300"} m-1 transition-all duration-300`}
            />
          )}
        </div>
        {!props.isLast && (
          <div
            className={`border ${props.isCompleted ? "border-black" : "border-gray-300"} h-full transition-all duration-300`}
          />
        )}
      </div>
      <div>
        <h3 className="mt-1 text-sm font-medium text-gray-800">
          {props.title}
        </h3>
        <p className="mb-6 text-sm text-gray-500">{props.subtitle}</p>
      </div>
    </div>
  );
};

const CheckSVG = () => (
  <svg
    width="13"
    height="11"
    viewBox="0 0 13 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.0964 0.390037L3.93638 7.30004L2.03638 5.27004C1.68638 4.94004 1.13638 4.92004 0.736381 5.20004C0.346381 5.49004 0.236381 6.00004 0.476381 6.41004L2.72638 10.07C2.94638 10.41 3.32638 10.62 3.75638 10.62C4.16638 10.62 4.55638 10.41 4.77638 10.07C5.13638 9.60004 12.0064 1.41004 12.0064 1.41004C12.9064 0.490037 11.8164 -0.319963 11.0964 0.380037V0.390037Z"
      fill="white"
    />
  </svg>
);
