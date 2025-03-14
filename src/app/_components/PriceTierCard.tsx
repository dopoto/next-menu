import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Feature, type PriceTier } from "../_domain/price-tiers";
import { Fragment, type ReactNode } from "react";
import { priceTierFeatures } from "../_domain/price-tier-features";

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

const getDisplayValue = (quota: Feature["quota"]) => {
  if (quota === true) return "yes";
  if (quota === false) return "no";
  if (typeof quota === "number") return quota.toString();
  return "--";
};

const getFeatureRow = (tier: PriceTier, feature: Feature) => {
  const featureDetails = priceTierFeatures[feature.id];
  const quota = tier.features.find((f) => f.id === feature.id)?.quota;

  if (!quota) {
    return null;
  }

  // if (max === -1) return `Please contact us`;
  // if (max === 0) return null;

  return (
    <div className="flex flex-row items-center gap-1">
      {/* <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
      <div>{getDisplayValue(quota)}</div> */}
      {featureDetails.resourceSingularName}|{quota}
    </div>
  );
};
