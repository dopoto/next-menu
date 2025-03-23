import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { Overview } from "../_components/Overview";
import { ROUTES } from "~/app/_domain/routes";
import { SuccessAnimation } from "~/app/_components/SuccessAnimation";
import { APP_CONFIG } from "~/app/_config/app-config";

export const metadata = {
  title: `${APP_CONFIG.appName} - Onboard > Overview`,
};

export default async function OverviewPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect(ROUTES.signUp);
  }

  const priceTierId = sessionClaims?.metadata?.tier;
  const parsedTier = getValidPriceTier(priceTierId);

  if (!parsedTier) {
    redirect(ROUTES.onboardSelectPlan);
  }
  const parsedTierId = parsedTier.id;

  return (
    <>
      <SplitScreenContainer
        mainComponent={
          <>
            <Overview claims={sessionClaims} />
          </>
        }
        secondaryComponent={
          <OnboardingStepper currentStep={"overview"} tierId={parsedTierId} />
        }
        title={"Welcome!"}
        subtitle={"Your onboarding is now completed"}
      ></SplitScreenContainer>
      <SuccessAnimation />
    </>
  );
}
