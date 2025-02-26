import * as React from "react";
import { MultiStepper } from "~/app/_components/MultiStepper";

export function OnboardMultiStepper(props: { step: number }) {
  return (
    <div className="max-w-[400px]">
      <MultiStepper
        steps={[
          { title: "Sign up", },
          { title: "Add organization", },
          { title: "Set up a location", },
        ]}
        currentStep={props.step}
      />
    </div>
  );
}
