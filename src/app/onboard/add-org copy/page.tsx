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

export default async function AddOrgPlanPage() {
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
  const nextStep = isFreePriceTier(parsedTierId)
    ? `/onboard/add-location`
    : `/onboard/payment`;

  const mainComponent = orgId ? (
    <OrgCreated />
  ) : (
    <CreateOrganization
      afterCreateOrganizationUrl={nextStep}
      skipInvitationScreen={true}
      hideSlug={true}
    />
  );

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      secondaryComponent={
        <OnboardingStepper currentStep={"addOrg"} tierId={parsedTierId} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
