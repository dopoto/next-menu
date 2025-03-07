import { auth } from "@clerk/nextjs/server";
import { CheckIcon } from "lucide-react";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PriceTier, type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

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
        return tier.isPublic ? (
          <Plan
            key={tier.name}
            tier={tier}
            isCurrent={currentUserTier === tier.id}
          />
        ) : null;
      })}
    </div>
  );
}

function Plan(props: { tier: PriceTier; isCurrent: boolean }) {
  const {
    id,
    name,
    description,
    monthlyUsdPrice,
    locations,
    menus,
    staffMembers,
    isPopular,
  } = props.tier;

  return (
    <Card
      className={`${props.isCurrent ? "border-2 border-blue-400 bg-gray-50" : ""}`}
    >
      <CardHeader className={`relative flex h-full flex-col`}>
        {props.isCurrent && (
          <div className="absolute top-5 -right-2 z-10 rotate-4 transform bg-blue-800 px-2 py-1 text-sm font-medium text-white shadow-md">
            Your current plan
          </div>
        )}
        <CardTitle className="text-xl font-light">{name}</CardTitle>
        <div className="font-medium">{getPrice(monthlyUsdPrice)}</div>
      </CardHeader>
      <CardContent>
        {/* TODO Refactor extract plan features to component */}
        <div className="flex flex-col flex-nowrap gap-2 text-sm">
          {getFeatureRow("location", "locations", locations)}
          {getFeatureRow("menu", "menus", menus)}
          {getFeatureRow("staff members", "staff members", staffMembers)}
        </div>
      </CardContent>
      <CardFooter>
        {!props.isCurrent && (
          <Link href={`/change-plan/${id}`} className="w-full">
            <Button className="w-full" variant="default">
              {monthlyUsdPrice === 0 ? "Downgrade to Free" : 
               monthlyUsdPrice > 0 ? "Change to this Plan" : "Contact Sales"}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

const getPrice = (monthlyUsdPrice: number) => {
  if (monthlyUsdPrice === -1) return `__.__`;
  if (monthlyUsdPrice === 0)
    return (
      <div>
        <span className="text-xl font-bold">FREE</span>
      </div>
    );
  return (
    <div>
      <span className="text-xl font-bold">${monthlyUsdPrice.toFixed(2)}</span>
      <span className="text-muted-foreground ml-1 text-xl font-light">
        /month
      </span>
    </div>
  );
};
const getFeatureRow = (
  singularName: string,
  pluralName: string,
  max: number,
) => {
  if (max === -1) return `Please contact us`;
  if (max === 0) return null;

  return (
    <div className="flex flex-row items-center gap-1">
      <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
      <div>{`${max} ${max > 1 ? pluralName : singularName}`}</div>
    </div>
  );
};
