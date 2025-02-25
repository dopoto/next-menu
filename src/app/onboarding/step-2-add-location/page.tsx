import { SplitScreenOnboard } from "~/app/_components/SplitScreenOnboard";
import { AddLocation } from "../_components/AddLocation";

export default async function OnboardingPage() {
  return (
    <SplitScreenOnboard
      step={3}
      mainComponent={<AddLocation />}
    ></SplitScreenOnboard>
  );
}