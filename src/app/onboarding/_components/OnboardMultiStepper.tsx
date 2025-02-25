import * as React from "react";
import { MultiStepper } from "~/app/_components/MultiStepper";

export function OnboardMultiStepper(props: { step: number }) {
  return (
    <div className="max-w-md">
      <MultiStepper
        steps={[
          { title: "Sign up", subtitle: "Create your account" },
          { title: "Add organization", subtitle: "A name and maybe a logo" },
          { title: "Set up a location", subtitle: "Just choose a name" },
        ]}
        currentStep={props.step}
      />
    </div>
  );
}
