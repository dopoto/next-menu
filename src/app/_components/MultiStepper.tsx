export function MultiStepper(props: {
  steps: Array<{ title: string; subtitle?: string }>;
  currentStep: number;
}) {
  return (
    <ul className="relative flex flex-col gap-2 md:flex-row">
      {props.steps.map((step, index) => (
        <li
          key={step.title}
          className="group flex flex-1 gap-x-2 md:block md:shrink md:basis-0"
        >
          <div className="flex min-h-7 min-w-7 flex-col items-center align-middle text-xs font-bold md:inline-flex md:w-full md:flex-row md:flex-wrap">
            <span
              className={`${props.currentStep === index + 1 ? "bg-blue-700 text-gray-300" : "bg-gray-300 text-gray-800"} flex size-7 shrink-0 items-center justify-center rounded-full font-medium`}
            >
              {index + 1}
            </span>
            <div className="mt-2 h-full w-px bg-gray-200 group-last:hidden md:ms-2 md:mt-0 md:h-px md:w-full md:flex-1"></div>
          </div>
          <div className="grow pb-5 md:mt-3 md:grow-0">
            <span className="block text-sm font-medium text-gray-800">
              {step.title}
            </span>
            <p className="text-xs text-gray-500">{step.subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
