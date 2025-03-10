import { auth } from "@clerk/nextjs/server";
import { CheckIcon } from "lucide-react";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import {
  type PriceTier,
  type PriceTierId,
  priceTiers,
} from "~/app/_domain/price-tiers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PriceTierCard } from "~/app/_components/PriceTierCard";

// TODO redirect out if not signed in

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
      {Object.entries(priceTiers).map(([_, tier]) => {
        const isCurrent = currentUserTier === tier.id;
        const footerCta = isCurrent ? null : (
          <Link href={`/change-plan/${tier.id}`} className="w-full">
            <Button className="w-full" variant="default">
              Change to this plan
            </Button>
          </Link>
        );

        return tier.isPublic ? (
          <PriceTierCard
            key={tier.name}
            tier={tier}
            isCurrent={isCurrent}
            footerCta={footerCta}
          />
        ) : null;
      })}
    </div>
  );
}
