import { SplitScreenContainer } from "../_components/SplitScreenContainer";
import { Onboarded } from "../OLDonboarding/_components/Onboarded";

export default async function OnboardedPage() {
  // TODO Keep? or handled in middleware already?
  // if ((await auth()).sessionClaims?.metadata.onboardingComplete !== true) {
  //   redirect("/onboarding");
  // }

  return (
    <SplitScreenContainer
      mainComponent={<Onboarded />}
      title={"Welcome aboard!"}
      subtitle={"Your onboarding is now completed"}
    ></SplitScreenContainer>
  );
}
