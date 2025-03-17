// import { SignedOut, SignUp } from "@clerk/nextjs";
// import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
// import { PriceTierIdSchema, priceTiers } from "~/app/_domain/price-tiers";
// import type { OnboardingStep } from "~/app/_domain/onboarding-steps";
// import {
//   CompletedStepIcon,
//   InProgressStepIcon,
//   MultiStepper,
//   UncompletedStepIcon,
// } from "~/app/_components/MultiStepper";
// import { PlanSelector } from "../_components/PlanSelector";

// type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// export default async function SignUpPage(props: {
//   searchParams: SearchParams;
// }) {
//   const searchParams = await props.searchParams;

//   const validationResult = PriceTierIdSchema.safeParse(searchParams.tier);

//   const parsedTier = validationResult.data;

//   // If a valid tier is passed as a search param, we'll take them straight to the sign up step

//   const tierStepTitle = parsedTier
//     ? `Chose the ${priceTiers[parsedTier].name} plan ($${priceTiers[parsedTier].monthlyUsdPrice.toFixed(2)}/month)`
//     : "Select a plan";
//   const tierStepIsActive = parsedTier ? false : true;
//   const tierStepIcon = parsedTier ? <CompletedStepIcon /> : <InProgressStepIcon />;

//   const signUpStepIsActive = parsedTier ? true: false;
//   const signUpStepIcon = parsedTier ? <InProgressStepIcon /> :<UncompletedStepIcon /> ; 

//   const currentStepComponent = parsedTier ? (
//     <SignUp
//       appearance={{
//         elements: {
//           headerTitle: "hidden",
//           headerSubtitle: "hidden",
//         },
//       }}
//     />
//   ) : (
//     <PlanSelector />
//   );

//   const steps: OnboardingStep[] = [
//     {
//       id: "tier",
//       title: tierStepTitle,
//       isActive: tierStepIsActive,
//       icon: tierStepIcon,
//     },
//     {
//       id: "signup",
//       title: "Sign up",
//       isActive: signUpStepIsActive,
//       icon: signUpStepIcon,
//     },
//     {
//       id: "addorg",
//       title: "Create your organization",
//       isActive: false,
//       icon: <UncompletedStepIcon />,
//     },
//     ...(parsedTier !== "start"
//       ? [
//           {
//             id: "pay",
//             title: "Pay with Stripe",
//             isActive: false,
//             icon: <UncompletedStepIcon />,
//           },
//         ]
//       : []),
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
//           mainComponent={currentStepComponent}
//           secondaryComponent={<MultiStepper steps={steps} />}
//           title={"Let's get you onboarded!"}
//           subtitle={"This should just take a minute..."}
//         ></SplitScreenContainer>
//       </SignedOut>
//       {/* <SignedIn>
//         <SplitScreenContainer
//           mainComponent={
//             <>signed in</>
//           }
//           secondaryComponent={null}
//           title={"Sign up"}
//           subtitle={""}
//         ></SplitScreenContainer>
//       </SignedIn> */}
//     </>
//   );
// }
