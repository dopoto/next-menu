import { SignUp } from "@clerk/nextjs";
import { MultiStepper } from "~/app/_components/MultiStepper";
import { PageTitle } from "~/app/_components/PageTitle";
import { PageSubtitle } from "~/app/_components/PageSubtitle";
import { PublicTopNav } from "~/app/_components/PublicTopNav";

export default function Page() {
  return (
    <div className="flex h-full w-full min-w-0 flex-auto flex-col items-center bg-amber-50 sm:flex-row sm:justify-center md:items-start md:justify-start">
      <div className="flex h-full w-full flex-col flex-nowrap gap-4 px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12   md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-16 md:shadow-none  ">
        <div className="py-6">
          <PublicTopNav />
        </div>
        <div className="flex flex-col flex-nowrap">
          <PageTitle>{"Let's get you onboarded!"}</PageTitle>
          <PageSubtitle>
            {"We'll just  need some very basic info to get you going"}
          </PageSubtitle>
        </div>
        <div className="max-w-md">
          <MultiStepper
            steps={[
              { title: "Sign up", subtitle: "Create your account" },
              { title: "Add an organization", subtitle: "Create your org" },
              { title: "Add a location", subtitle: "Create your location" },
            ]}
            currentStep={1}
          />
        </div>

        {/* TODO appearance */}
        <SignUp
          appearance={{
            elements: {
              card: {
                border: "none",
                boxShadow: "none",
              },
            },
          }}
        />
      </div>
      <div className="bg-blue-800 relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 lg:flex lg:px-28">
        welc
      </div>
    </div>
  );
}
