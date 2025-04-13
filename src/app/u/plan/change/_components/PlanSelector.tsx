import { auth } from "@clerk/nextjs/server";
import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  getCurrentPlanCardCustomizations,
  getExceededPlanCardCustomizations,
  PriceTierCard,
} from "~/app/_components/PriceTierCard";
import { SeparatorWithText } from "~/app/_components/SeparatorWithText";
import { getExceededFeatures } from "~/app/_utils/price-tier-utils.server-only";
import { ROUTES } from "~/app/_domain/routes";

export async function PlanSelector() {
  const currentUserTier = (await auth()).sessionClaims?.metadata
    ?.tier as PriceTierId;

  return (
    <div className="flex flex-col gap-3">
      <div className="pb-4">
        {`Next, we'll show you an overview page where you'll be able to complete
        the plan changes.`}
      </div>
      {Object.entries(priceTiers).map(async ([, tier]) => {
        if (!tier.isPublic) {
          return null;
        }

        const isCurrent = currentUserTier === tier.id;

        const exceededFeatures = await getExceededFeatures(
          currentUserTier,
          tier.id,
        );

        const cardCustomizations = isCurrent
          ? getCurrentPlanCardCustomizations()
          : exceededFeatures.length > 0
            ? getExceededPlanCardCustomizations()
            : undefined;

        const footerCta = isCurrent ? (
          <Link href={ROUTES.viewPlan} className="w-full">
            <Button variant="secondary" className="w-full">
              View plan usage
            </Button>
          </Link>
        ) : exceededFeatures.length === 0 ? (
          <Link href={ROUTES.changePlanTo(tier.id)} className="w-full">
            <Button variant="default" className="w-full">
              Change to this plan
            </Button>
          </Link>
        ) : (
          <Button variant="default" className="w-full italic" disabled>
            Cannot change to this plan
          </Button>
        );

        return (
          <PriceTierCard
            key={tier.name}
            tier={tier}
            cardCustomizations={cardCustomizations}
            exceededFeatures={exceededFeatures}
            footerCta={footerCta}
          />
        );
      })}
      <SeparatorWithText title={"Not ready for a change yet?"} />
      <div className="flex w-full flex-col gap-0">
        <div className="pb-6">
          Remember that you can upgrade, downgrade, cancel or delete your
          account instantly, anytime.
        </div>
        <Link href={ROUTES.my} className="w-full">
          <Button variant="outline" className="w-full">
            Go back to my account
          </Button>
        </Link>
      </div>
    </div>
  );
}
