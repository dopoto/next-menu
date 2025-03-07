import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import Link from "next/link";

type StripeSubscriptionManagementProps = {
  currentTierId: PriceTierId;
  targetTierId: PriceTierId;
  hasSubscription: boolean;
  userId: string;
  orgId: string;
};

export function StripeSubscriptionManagement({
  currentTierId,
  targetTierId,
  hasSubscription,
  userId,
  orgId,
}: StripeSubscriptionManagementProps) {
  // Determine the scenario
  const isUpgradeFromFree = currentTierId === "start" && targetTierId !== "start";
  const isDowngradeToFree = currentTierId !== "start" && targetTierId === "start";
  const isPaidToPaid = currentTierId !== "start" && targetTierId !== "start";
  const isUpgrade = isPaidToPaid && priceTiers[targetTierId].monthlyUsdPrice > priceTiers[currentTierId].monthlyUsdPrice;

  // Determine the appropriate button text
  let buttonText: string;
  let buttonVariant: "default" | "destructive" = "default";

  if (isUpgradeFromFree) {
    buttonText = `Subscribe to ${priceTiers[targetTierId].name}`;
  } else if (isDowngradeToFree) {
    buttonText = "Cancel Subscription";
    buttonVariant = "destructive";
  } else if (isUpgrade) {
    buttonText = `Upgrade to ${priceTiers[targetTierId].name}`;
  } else {
    buttonText = `Downgrade to ${priceTiers[targetTierId].name}`;
  }

  // Create the subscription change URLs using organization ID
  const changeUrl = isUpgradeFromFree 
    ? `/change-plan/subscribe?targetTierId=${targetTierId}`
    : isDowngradeToFree
    ? `/change-plan/cancel`
    : `/change-plan/modify?targetTierId=${targetTierId}&isUpgrade=${isUpgrade}`;

  return (
    <Link href={changeUrl} className="w-full">
      <Button variant={buttonVariant} className="w-full">
        {buttonText}
      </Button>
    </Link>
  );
} 