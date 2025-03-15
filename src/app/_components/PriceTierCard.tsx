import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Feature, type PriceTier } from "../_domain/price-tiers";
import { Fragment, type ReactNode } from "react";
import {
  type PriceTierFeature,
  priceTierFeatures,
} from "../_domain/price-tier-features";
import { CheckIcon } from "lucide-react";

export type CardCustomizations = {
  containerStyle?: string;
  badgeStyle?: string;
  badgeText?: string;
};

export function PriceTierCard(props: {
  tier: PriceTier;
  cardCustomizations?: CardCustomizations;
  footerCta?: ReactNode;
}) {
  const { name, monthlyUsdPrice, features } = props.tier;

  return (
    <Card className={`${props.cardCustomizations?.containerStyle}`}>
      <CardHeader className={`relative flex h-full flex-col`}>
        {props.cardCustomizations?.badgeText && (
          <div
            className={`absolute top-5 -right-2 z-10 rotate-4 transform px-2 py-1 text-sm font-medium text-white shadow-md ${props.cardCustomizations?.badgeStyle}`}
          >
            {props.cardCustomizations?.badgeText}
          </div>
        )}
        <CardTitle className="text-xl font-light">{name}</CardTitle>
        <div className="font-medium">{getPrice(monthlyUsdPrice)}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-nowrap gap-2 text-sm">
          {features.map((feature) => (
            <Fragment key={feature.id}>
              {getFeatureRow(props.tier, feature)}
            </Fragment>
          ))}
        </div>
      </CardContent>
      {props.footerCta && <CardFooter>{props.footerCta}</CardFooter>}
    </Card>
  );
}

export const getCurrentPlanCardCustomizations = (): CardCustomizations => {
  return {
    containerStyle: "border-2 border-blue-700",
    badgeStyle: "bg-blue-800",
    badgeText: "Your current plan",
  };
};

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

const getDisplayValue = (
  featureDetails: PriceTierFeature,
  quota: Feature["quota"],
) => {
  if (typeof quota === "number")
    return (
      <>
        <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
        {quota.toString()}{" "}
        {quota > 1
          ? featureDetails.resourcePluralName
          : featureDetails.resourceSingularName}
      </>
    );
  return "--";
};

const getFeatureRow = (tier: PriceTier, feature: Feature) => {
  const featureDetails = priceTierFeatures[feature.id];
  const quota = tier.features.find((f) => f.id === feature.id)?.quota;

  if (!quota) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {getDisplayValue(featureDetails, quota)}
    </div>
  );
};
