import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type Flag,
  type Feature,
  type PriceTier,
} from "../_domain/price-tiers";
import { Fragment, type ReactNode } from "react";
import {
  type ExceededFeature,
  type PriceTierFeature,
} from "../_domain/price-tier-features";
import { CheckIcon, CircleXIcon } from "lucide-react";
import { PageSubtitle } from "./PageSubtitle";
import {
  type PriceTierFlag,
  priceTierFlags,
} from "~/app/_domain/price-tier-flags";
import { priceTierFeatures } from "~/app/_domain/price-tier-features-config";

export type CardCustomizations = {
  containerStyle?: string;
  badgeStyle?: string;
  badgeText?: string;
};

export function PriceTierCard(props: {
  tier: PriceTier;
  cardCustomizations?: CardCustomizations;
  exceededFeatures?: Array<ExceededFeature>;
  footerCta?: ReactNode;
}) {
  const { name, description, monthlyUsdPrice, features, flags } = props.tier;

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
        <CardDescription>
          <PageSubtitle>{description}</PageSubtitle>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-nowrap gap-2 text-sm">
          {features.map((feature) => (
            <Fragment key={feature.id}>
              {getFeatureRow(props.tier, feature)}
            </Fragment>
          ))}
          {props.exceededFeatures?.map((exceededFeature) => (
            <Fragment key={exceededFeature.id}>
              {getExceededFeatureRow(exceededFeature)}
            </Fragment>
          ))}
          {flags.map((flag) => (
            <Fragment key={flag.id}>{getFlagRow(props.tier, flag)}</Fragment>
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

export const getExceededPlanCardCustomizations = (): CardCustomizations => {
  return {
    containerStyle: "border-2 border-red-700 bg-gray-100 dark:bg-gray-800",
    badgeStyle: "bg-red-800",
    badgeText: "Does not fit your current usage",
  };
};

export const getPrice = (monthlyUsdPrice: number) => {
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

const getFeatureDisplayValue = (
  itemDetails: PriceTierFeature,
  quota: Feature["quota"],
) => {
  if (typeof quota === "number")
    return (
      <>
        <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
        {quota.toString()}{" "}
        {quota > 1
          ? itemDetails.resourcePluralName
          : itemDetails.resourceSingularName}
      </>
    );
  return "--";
};

export const getFeatureRow = (tier: PriceTier, feature: Feature) => {
  const featureDetails = priceTierFeatures[feature.id];
  const quota = tier.features.find((f) => f.id === feature.id)?.quota;

  if (!quota) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {getFeatureDisplayValue(featureDetails, quota)}
    </div>
  );
};

const getFlagDisplayValue = (
  itemDetails: PriceTierFlag,
  isEnabled: boolean,
) => {
  if (!isEnabled) return null;

  return (
    <>
      <CheckIcon strokeWidth={3} className="size-4 stroke-green-600" />
      {itemDetails.resourcePluralName}
    </>
  );
};

export const getFlagRow = (tier: PriceTier, flag: Flag) => {
  const flagDetails = priceTierFlags[flag.id];
  const isEnabled =
    tier.flags.find((f) => f.id === flag.id)?.isEnabled ?? false;

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-1 capitalize">
      {getFlagDisplayValue(flagDetails, isEnabled)}
    </div>
  );
};

export const getExceededFeatureRow = (feature: ExceededFeature) => {
  const featureDetails = priceTierFeatures[feature.id];

  return (
    <div className="flex flex-row items-center gap-1 text-red-600 dark:text-red-400">
      <CircleXIcon
        strokeWidth={3}
        className="size-4 stroke-red-600 dark:stroke-red-400"
      />{" "}
      0 {featureDetails.resourcePluralName} (you are using {feature.used})
    </div>
  );
};
