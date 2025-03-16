// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
// import { SideHeroCarousel } from "~/app/onboarding/_components/SideHeroCarousel";
// import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
// import {
//   CompletedStepIcon,
//   InProgressStepIcon,
//   MultiStepper,
//   UncompletedStepIcon,
// } from "~/app/_components/MultiStepper";
// import { PlanSelector } from "../_components/PlanSelector";

// type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// export default async function SignUpSelectPlanPage(_props: {
//   searchParams: SearchParams;
// }) {
//   const steps: OnboardingStep[] = [
//     {
//       id: "tier",
//       title: `Select a plan`,
//       isActive: true,
//       icon: <CompletedStepIcon />,
//     },
//     {
//       id: "signup",
//       title: "Sign up",
//       isActive: false,
//       icon: <InProgressStepIcon />,
//     },
//     {
//       id: "addorg",
//       title: "Create your organization",
//       isActive: false,
//       icon: <UncompletedStepIcon />,
//     },
//     {
//       id: "addloc",
//       title: "Create your first location",
//       isActive: false,
//       icon: <UncompletedStepIcon />,
//     },
//   ];

//   return (
//     <>
//       <SignedOut>
//         <SplitScreenContainer
//           mainComponent={<PlanSelector />}
//           secondaryComponent={<MultiStepper steps={steps} />}
//           title={"Let's get you onboarded!"}
//           subtitle={"This should just take a minute..."}
//         ></SplitScreenContainer>
//       </SignedOut>
//       <SignedIn>
//         <SplitScreenContainer
//           mainComponent={<>signed in. TODO</>}
//           secondaryComponent={null}
//           title={"Sign up"}
//           subtitle={""}
//         ></SplitScreenContainer>
//       </SignedIn>
//     </>
//   );
// }
