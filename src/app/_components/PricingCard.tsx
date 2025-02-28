import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type PriceTier } from "../_domain/price-tiers";
import { PageTitle } from "./PageTitle";
import { PageSubtitle } from "./PageSubtitle";

const getFeatureText = (singularName: string, pluralName: string, max: number) => {
  if (max === -1) return `Please contact us`;
  return `${max} ${max > 1 ? pluralName : singularName}`;
};

const getPrice = (monthlyUsdPrice: number) => {
  if (monthlyUsdPrice === -1) return `__.__`;
  return (
    <div className="mt-2">
      <span className="text-4xl font-bold">${monthlyUsdPrice.toFixed(2)}</span>
      <span className="text-muted-foreground ml-1 text-2xl font-light">
        /month
      </span>
    </div>
  );
};

export function PricingCard(props: { tier: PriceTier }) {
  const {
    id,
    name,
    description,
    monthlyUsdPrice,
    locations,
    menus,
    staffMembers,
    isEnabled,
  } = props.tier;

  return (
    <Card className={`w-[350px] ${!isEnabled ? "opacity-50" : ""}`}>
      <CardHeader className={`relative`}>
        {!isEnabled && (
          <div className="absolute top-5 -right-2 z-10 rotate-4 transform bg-red-700 px-2 py-1 text-sm font-medium text-white shadow-md">
            Coming soon!
          </div>
        )}
        <CardTitle>
          <PageTitle>{name}</PageTitle>
        </CardTitle>
        <div className="text-4xl font-medium">{getPrice(monthlyUsdPrice)}</div>
        <CardDescription>
          <PageSubtitle>{description}</PageSubtitle>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-nowrap gap-2 text-sm">
          <div className="flex flex-row items-center gap-1">
            <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
            <div>{getFeatureText("location", "locations",locations)}</div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
            <div>{getFeatureText("menu","menus", menus)}</div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
            <div>{getFeatureText("staff members", "staff members", staffMembers)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEnabled ? (
          <Link href={`/sign-up?tier=${id}`} className="w-full">
            <Button className="w-full" variant="default">
              Get started
            </Button>
          </Link>
        ) : (
          <Button disabled className="w-full" variant="outline">
            Get started
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
