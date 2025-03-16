import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { PlanSelector } from "../_components/PlanSelector";

export default function ChangePlanPage() {
  return (
    <SplitScreenContainer
      mainComponent={<PlanSelector />}
      title={"Change your plan"}
      subtitle={"Please select a new plan below"}
    ></SplitScreenContainer>
  );
}

