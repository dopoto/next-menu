import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { CookieKey } from "~/app/_domain/cookies";
import { getValidPaidPriceTier } from "~/app/_utils/price-tier-utils";
import { CheckoutForm } from "../_components/CheckoutForm";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { ROUTES } from "~/app/_domain/routes";

export default async function OnboardPaymentPage() {
  const { userId, orgId } = await auth();
  if (!userId) {
    redirect(ROUTES.signUp);
  }
  if (!orgId) {
    redirect(ROUTES.onboardCreateOrg);
  }

  const cookieStore = cookies();
  const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
  const parsedTier = getValidPaidPriceTier(tier);
  if (!parsedTier) {
    redirect(ROUTES.onboardSelectPlan);
  }

  const stripePriceId = parsedTier.stripePriceId;
  if (!stripePriceId) {
    throw new Error(`Stripe price id not found for tier ${parsedTier.id}`);
  }

  return (
    <SplitScreenContainer
      mainComponent={<CheckoutForm priceTierId={parsedTier.id} />}
      secondaryComponent={
        <OnboardingStepper currentStep={"pay"} tierId={parsedTier.id} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
