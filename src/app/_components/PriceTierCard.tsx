import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { type PriceTier } from "../_domain/price-tiers";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CheckIcon } from "lucide-react";
import { type ReactNode } from "react";

export function PriceTierCard  (props: { tier: PriceTier; isCurrent: boolean, footerCta?: ReactNode }) {
  const {
    id,
    name,
    monthlyUsdPrice,
    locations,
    menus,
    staffMembers,
  } = props.tier;

  return (
    <Card className={`${props.isCurrent ? "border-2 border-blue-700" : ""}`}>
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
      {props.footerCta && <CardFooter>{props.footerCta}</CardFooter>}
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
