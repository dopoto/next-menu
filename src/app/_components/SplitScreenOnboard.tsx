import { SignUp } from "@clerk/nextjs";
import { type ReactNode } from "react";
import { MultiStepper } from "./MultiStepper";
import { PageSubtitle } from "./PageSubtitle";
import { PublicTopNav } from "./PublicTopNav";
import { PageTitle } from "./PageTitle";

export function SplitScreenOnboard(props: {
  step?: number;
  mainComponent: ReactNode;
}) {
  return (
    <div className="flex h-full w-full min-w-0 flex-auto flex-col items-center bg-amber-50 sm:flex-row sm:justify-center">
      <div className="flex h-full w-full flex-col flex-nowrap gap-4 px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 md:p-16">
        <div className="py-6">
          <PublicTopNav />
        </div>
        <div className="flex flex-col flex-nowrap">
          <PageTitle>{"Let's get you onboarded!"}</PageTitle>
          <PageSubtitle>{"This should just take a minute..."}</PageSubtitle>
        </div>
        
        {props.step && (
          <div className="max-w-md">
            <MultiStepper
              steps={[
                { title: "Sign up", subtitle: "Create your account" },
                { title: "Add organization", subtitle: "Just choose a name" },
                { title: "Set up a location", subtitle: "Just choose a name" },
              ]}
              currentStep={props.step}
            />
          </div>
        )}

        {/* TODO appearance */}
        {props.mainComponent}
      </div>
      <div className="relative hidden h-full flex-auto items-center justify-center overflow-hidden bg-blue-900 p-16 lg:flex lg:px-28">
        welcs
      </div>
    </div>
  );
}
