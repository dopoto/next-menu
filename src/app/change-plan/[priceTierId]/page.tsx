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
  priceTiers,
  type PriceTierId,
} from "~/app/_domain/price-tiers";
import Link from "next/link";
import { StripeSubscriptionManagement } from "../_components/StripeSubscriptionManagement";

export type Params = Promise<{ priceTierId: string }>;

export default async function ChangePlanDetailPage(props: { params: Params }) {
  const params = await props.params;
  const parsedPriceTierResult = PriceTierIdSchema.safeParse(params.priceTierId);
  if (!parsedPriceTierResult.success) {
    return notFound();
  }
  const targetTierId = parsedPriceTierResult.data;
  const targetTier = priceTiers[targetTierId];

  // Get the current user's tier
  const currentUserInfo = await auth();
  const userId = currentUserInfo.userId;
  const orgId = currentUserInfo.orgId;
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  //TODO handle missing tier - do not fallback to default
  const currentTierId =
    (currentUserInfo.sessionClaims?.metadata?.tier as PriceTierId) ||
    defaultTier;

  // If user tries to change to their current tier, redirect back
  if (targetTierId === currentTierId) {
    return redirect("/change-plan");
  }

  //TODO refactor extract to fn
  let title: string;
  let description: string;

  if (targetTierId === "start") {
    title = "Downgrade to Free Plan";
    description =
      "You're about to downgrade to our Free plan. Your current paid features will remain active until the end of your billing period.";
  } else if (currentTierId === "start") {
    title = `Upgrade to ${targetTier.name} Plan`;
    description = `You're about to upgrade to our ${targetTier.name} plan with additional features.`;
  } else {
    const isUpgrade =
      targetTier.monthlyUsdPrice > priceTiers[currentTierId].monthlyUsdPrice;
    title = isUpgrade
      ? `Upgrade to ${targetTier.name} Plan`
      : `Downgrade to ${targetTier.name} Plan`;
    description = isUpgrade
      ? `You're about to upgrade from ${priceTiers[currentTierId].name} to ${targetTier.name}. The new rate will be applied immediately.`
      : `You're about to downgrade from ${priceTiers[currentTierId].name} to ${targetTier.name}. The new rate will be applied at the end of your current billing cycle.`;
  }

  return (
    <SplitScreenContainer
      mainComponent={
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
                  <span className="font-semibold">
                    {priceTiers[currentTierId].name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>New Plan:</span>
                  <span className="font-semibold">{targetTier.name}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span>Current Price:</span>
                  <span className="font-semibold">
                    {priceTiers[currentTierId].monthlyUsdPrice === 0
                      ? "Free"
                      : `$${priceTiers[currentTierId].monthlyUsdPrice}/month`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>New Price:</span>
                  <span className="font-semibold">
                    {targetTier.monthlyUsdPrice === 0
                      ? "Free"
                      : `$${targetTier.monthlyUsdPrice}/month`}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <StripeSubscriptionManagement
                fromTierId={currentTierId}
                toTierId={targetTierId}
              />

              <Link href="/change-plan" className="w-full">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      }
      title="Change Plan"
      subtitle="Review your plan change"
    />
  );
}
