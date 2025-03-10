import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { Button } from "~/components/ui/button";
import { isPriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import Link from "next/link";
import { PriceTierCard } from "~/app/_components/PriceTierCard";
import SvgIcon from "~/app/_components/SvgIcons";
import { getPriceTierChangeScenario } from "~/app/_utils/price-tier-utils";

export type Params = Promise<{ priceTierId: string }>;

export default async function ChangePlanDetailPage(props: { params: Params }) {
  const params = await props.params;

  if (!isPriceTierId(params.priceTierId)) {
    return notFound();
  }

  const parsedToTier = priceTiers[params.priceTierId];

  console.log(parsedToTier);

  const { userId, orgId, sessionClaims } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  if (!isPriceTierId(sessionClaims?.metadata?.tier)) {
    return notFound();
  }

  const parsedFromTier = priceTiers[sessionClaims?.metadata?.tier];

  // If user tries to change to their current tier, redirect back
  if (parsedToTier.id === parsedFromTier.id) {
    return redirect("/change-plan");
  }

  const changePlanScenario = getPriceTierChangeScenario(
    parsedFromTier.id,
    parsedToTier.id,
  );

  let description = "";
  let buttonText = "";
  let changeUrl = "";

  // TODO check if current plan has more features than future plan

  switch (changePlanScenario) {
    case "free-to-paid":
      description = `You're about to upgrade to our ${parsedToTier.name} plan. You will get access to all the additional features immediately.`;
      buttonText = `Subscribe to ${parsedToTier.name}`;
      changeUrl = `/change-plan/subscribe?toTierId=${parsedToTier.id}`;
      break;
    case "free-to-free":
      description = `You're about to move from our ${parsedFromTier.name} plan to our ${parsedToTier.name} plan. The new feature set will become available to you right away.`;
      buttonText = `Change to ${parsedToTier.name}`;
      changeUrl = `/change-plan/subscribe?toTierId=${parsedToTier.name}`;
      break;
    case "paid-to-free":
      description = `You're about to move from our ${parsedFromTier.name} plan to our ${parsedToTier.name} plan. 
        Your account will be credited right away with an amount corresponding to the remaining days in your current 
        monthly subscription. The new feature set will become available to you right away.`;
        buttonText = `Downgrade to ${parsedToTier.name}`;    
      changeUrl = `/change-plan/cancel`;
      break;
    case "paid-to-paid-upgrade":
      description = `You're about to move from our ${parsedFromTier.name} plan to our ${parsedToTier.name} plan. 
        Your account will be debited now with the difference between the two monthly subscriptions, corresponding 
        to the remaining days in your current month. The new feature set will become available to you right away.`;
      buttonText = `Upgrade to ${parsedToTier.name}`;
      changeUrl = `/change-plan/modify?targetTierId=${parsedToTier.id}`;
      break;
    case "paid-to-paid-downgrade":
      description = `You're about to move from our ${parsedFromTier.name} plan to our ${parsedToTier.name} plan. 
        Your account will be credited now with the difference between the two monthly subscriptions, corresponding 
        to the remaining days in your current month. The new feature set will become available to you right away.`;
      buttonText = `Downgrade to ${parsedToTier.name}`;
      changeUrl = `/change-plan/modify?targetTierId=${parsedToTier.id}`;
      break;
    default:
      return null;
  }

  return (
    <SplitScreenContainer
      mainComponent={
        <div className="flex flex-col flex-nowrap gap-4">
          <p className="pb-4 text-sm">{description}</p>
          <PriceTierCard tier={parsedFromTier} isCurrent={true} />
          <SvgIcon
            kind={"arrowDoodle"}
            className={"fill-gray-500 stroke-gray-500 dark:fill-gray-400 dark:stroke-gray-400"}
          />
          <PriceTierCard tier={parsedToTier} isCurrent={false} />
          <div className="flex w-full flex-col gap-2 pt-4">
            <Link href={changeUrl} className="w-full">
              <Button variant={'default'}  className="w-full">
                {buttonText}
              </Button>
            </Link>
            <Link href="/change-plan" className="w-full">
              <Button variant="outline" className="w-full">
                Go back
              </Button>
            </Link>
          </div>
        </div>
      }
      title="Change Plan"
      subtitle="Review your plan change"
    />
  );
}
