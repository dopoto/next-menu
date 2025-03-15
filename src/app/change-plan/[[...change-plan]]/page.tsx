import { auth } from "@clerk/nextjs/server";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  CardCustomizations,
  getCurrentPlanCardCustomizations,
  PriceTierCard,
} from "~/app/_components/PriceTierCard";
import { SeparatorWithText } from "~/app/_components/SeparatorWithText";

export default function ChangePlanPage() {
  return (
    <SplitScreenContainer
      mainComponent={<PlanSelector />}
      title={"Change your plan"}
      subtitle={"Please select a new plan below"}
    ></SplitScreenContainer>
  );
}

async function PlanSelector() {
  const currentUserTier = (await auth()).sessionClaims?.metadata
    ?.tier as PriceTierId;

  return (
    <div className="flex flex-col gap-3">
      <p className="max-w-md text-sm">
        {
          "Next, we'll show you an overview page where you'll be able to complete the plan change."
        }
      </p>
      {Object.entries(priceTiers).map(([_, tier]) => {
        if (!tier.isPublic) {
          return null;
        }

        const isCurrent = currentUserTier === tier.id;

        const cardCustomizations = isCurrent
          ? getCurrentPlanCardCustomizations()
          : undefined;

        const footerCta = isCurrent ? (
          <Link href="/view-plan" className="w-full">
            <Button variant="outline" className="w-full">
              View plan usage
            </Button>
          </Link>
        ) : (
          <Link href={`/change-plan/${tier.id}`} className="w-full">
            <Button className="w-full" variant="default">
              Change to this plan
            </Button>
          </Link>
        );

        return (
          <PriceTierCard
            key={tier.name}
            tier={tier}
            cardCustomizations={cardCustomizations}
            footerCta={footerCta}
          />
        );
      })}
      <SeparatorWithText title={"Not ready for a change yet?"} />
      <div className="flex w-full flex-col gap-2">
        <p className="pb-4">
          Remember that you can upgrade, downgrade or cancel instantly,
          anytime.{" "}
        </p>
        <Link href="/my" className="w-full">
          <Button variant="outline" className="w-full">
            Go back to my account
          </Button>
        </Link>
        <Link href="/view-plan" className="w-full">
            <Button variant="outline" className="w-full">
              View plan usage
            </Button>
          </Link>
      </div>
    </div>
  );
}
