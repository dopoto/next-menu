import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  PriceTierIdSchema,
  defaultTier,
  isPriceTierId,
  priceTiers,
  type PriceTierId,
} from "~/app/_domain/price-tiers";
import Link from "next/link";
import { StripeSubscriptionManagement } from "../_components/StripeSubscriptionManagement";
import { PriceTierCard } from "~/app/_components/PriceTierCard";
import SvgIcon from "~/app/_components/SvgIcons";

export type Params = Promise<{ priceTierId: string }>;

export default async function ChangePlanDetailPage(props: { params: Params }) {
  const params = await props.params;

  if (!isPriceTierId(params.priceTierId)) {
    return notFound();
  }

  const parsedToTier = priceTiers[params.priceTierId];

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

  //TODO refactor extract to fn
  let title: string;
  let description: string;

  if (parsedToTier.id === "start") {
    title = "Downgrade to Free Plan";
    description =
      "You're about to downgrade to our Free plan. Your current paid features will remain active until the end of your billing period.";
  } else if (parsedFromTier.id === "start") {
    title = `Upgrade to ${parsedToTier.name} Plan`;
    description = `You're about to upgrade to our ${parsedToTier.name} plan with additional features.`;
  } else {
    const isUpgrade =
      parsedToTier.monthlyUsdPrice > parsedFromTier.monthlyUsdPrice;
    title = isUpgrade
      ? `Upgrade to ${parsedToTier.name} Plan`
      : `Downgrade to ${parsedToTier.name} Plan`;
    description = isUpgrade
      ? `You're about to upgrade from ${parsedFromTier.name} to ${parsedToTier.name}. The new rate will be applied immediately.`
      : `You're about to downgrade from ${parsedFromTier.name} to ${parsedToTier.name}. The new rate will be applied at the end of your current billing cycle.`;
  }

  return (
    <SplitScreenContainer
      mainComponent={
        <>
          <div className="flex flex-col flex-nowrap gap-4">
            <PriceTierCard tier={parsedFromTier} isCurrent={true} />
            <SvgIcon kind={"arrowDoodle"} className={'dark:stroke-white dark:fill-white'} />
            <PriceTierCard tier={parsedFromTier} isCurrent={false} />
          </div>
          <div className="flex flex-col space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Plan:</span>
                    <span className="font-semibold">{parsedFromTier.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>New Plan:</span>
                    <span className="font-semibold">{parsedToTier.name}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span>Current Price:</span>
                    <span className="font-semibold">
                      {parsedFromTier.monthlyUsdPrice === 0
                        ? "Free"
                        : `$${parsedFromTier.monthlyUsdPrice}/month`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>New Price:</span>
                    <span className="font-semibold">
                      {parsedToTier.monthlyUsdPrice === 0
                        ? "Free"
                        : `$${parsedToTier.monthlyUsdPrice}/month`}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <StripeSubscriptionManagement
                  fromTierId={parsedFromTier.id}
                  toTierId={parsedToTier.id}
                />

                <Link href="/change-plan" className="w-full">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </>
      }
      title="Change Plan"
      subtitle="Review your plan change"
    />
  );
}
