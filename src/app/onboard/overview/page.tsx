import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { CreateOrganization, OrganizationList } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CookieKey } from "~/app/_domain/cookies";
import {
  getValidPriceTier,
  isFreePriceTier,
} from "~/app/_utils/price-tier-utils";
import { OrgCreated } from "../_components/OrgCreated";
import { Overview } from "../_components/Overview";

export default async function OverviewPage() {
  const { userId, orgId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const cookieStore = cookies();
  const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
  const parsedTier = getValidPriceTier(tier);

  if (!parsedTier) {
    redirect("/onboard/select-plan");
  }
  const parsedTierId = parsedTier.id;
 

 

  return (
    <SplitScreenContainer
      mainComponent={<Overview/>}
      secondaryComponent={
        <OnboardingStepper currentStep={"overview"} tierId={parsedTierId} />
      }
      title={"Welcome!"}
      subtitle={"Your onboarding is now completed"}
    ></SplitScreenContainer>
  );
}
