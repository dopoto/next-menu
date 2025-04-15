import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { OnboardingStepper } from "../_components/OnboardingStepper";
import { Redirecting } from "../_components/Redirecting";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CookieKey } from "~/app/_domain/cookies";
import { getValidPaidPriceTier } from "~/app/_utils/price-tier-utils";
import { ROUTES } from "~/lib/routes";

type SearchParams = Promise<
  Record<"session_id", string | string[] | undefined>
>;

export default async function OnboardPostPaymentPage(props: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
  const parsedTier = getValidPaidPriceTier(tier);
  if (!parsedTier) {
    redirect(ROUTES.onboardSelectPlan);
  }

  // Get the status of the Stripe payment
  const searchParams = await props.searchParams;
  const stripeSessionId = searchParams.session_id?.toString() ?? "";

  return (
    <SplitScreenContainer
      mainComponent={<Redirecting stripeSessionId={stripeSessionId} />}
      secondaryComponent={
        <OnboardingStepper currentStep={"pay"} tierId={parsedTier.id} />
      }
      title={"Let's get you onboarded!"}
      subtitle={"This should just take a minute..."}
    ></SplitScreenContainer>
  );
}
