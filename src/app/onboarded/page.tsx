import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SplitScreenOnboard } from "../_components/SplitScreenOnboard";
import { Onboarded } from "../onboarding/_components/Onboarded";

export default async function OnboardedPage() {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete !== true) {
    redirect("/onboarding");
  }

  return (
    <SplitScreenOnboard mainComponent={<Onboarded />}></SplitScreenOnboard>
  );
}
