import { InfoIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { PriceTierHeader } from '~/components/PriceTierHeader';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { priceTierFeatures } from '~/domain/price-tier-features';
import { priceTierFlags } from '~/domain/price-tier-flags';
import { type ExceededFeature } from '~/domain/price-tier-usage';
import { type PriceTier } from '~/domain/price-tiers';

export type CardCustomizations = {
    containerStyle?: string;
    badgeStyle?: string;
    badgeText?: string;
};

const enabledTextColor = 'text-gray-900 dark:text-white';
const disabledTextColor = 'text-gray-400 dark:text-gray-500';

function FeatureBadge({ quota }: { quota: number | boolean }) {
    const content = typeof quota === 'number' ? <>{quota}</> : <>{quota ? 'YES' : 'NO'}</>;
    return (
        <Badge
            variant={quota ? 'secondary' : 'outline'}
            className={`h-[22px] w-[45px] font-bold ${quota ? enabledTextColor : disabledTextColor}`}
        >
            {content}
        </Badge>
    );
}

function DashedLine() {
    return <div className={`mx-2 flex-grow self-center border-b border-dotted border-gray-600`} />;
}

export function PriceTierCard(props: {
    tier: PriceTier;
    cardCustomizations?: CardCustomizations;
    exceededFeatures?: Array<ExceededFeature>;
    footerCta?: ReactNode;
}) {
    const { name, description, features, flags } = props.tier;

    const availableFeatures =
        props.exceededFeatures && props.exceededFeatures.length > 0
            ? features.filter((f) => {
                  return props.exceededFeatures?.findIndex((ef) => ef.id === f.id) === -1;
              })
            : features;

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
                <PriceTierHeader tier={props.tier} />
                <CardTitle className="sr-only">{name}</CardTitle>
                <CardDescription className="sr-only">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col flex-nowrap gap-2 text-sm">
                    {availableFeatures.map((feature) => {
                        const featureDetails = priceTierFeatures[feature.id];
                        const quota = props.tier.features.find((f) => f.id === feature.id)?.quota ?? 0;
                        return (
                            <div key={feature.id} className="flex items-center">
                                <div
                                    className={`flex-shrink-0 flex flex-row items-center gap-1 text-left capitalize ${quota ? enabledTextColor : disabledTextColor}`}
                                >
                                    <Info
                                        title={featureDetails.resourcePluralName}
                                        text={featureDetails.description}
                                        footer={`${quota} available in this plan`}
                                    />
                                    <span>{featureDetails.resourcePluralName}</span>
                                </div>
                                <DashedLine />
                                <div className="flex-shrink-0 text-right">
                                    <FeatureBadge quota={quota} />
                                </div>
                            </div>
                        );
                    })}
                    {props.exceededFeatures?.map((exceededFeature) => {
                        const featureDetails = priceTierFeatures[exceededFeature.id];
                        const quota = props.tier.features.find((f) => f.id === exceededFeature.id)?.quota ?? 0;

                        return (
                            <div key={exceededFeature.id}>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex flex-row items-center gap-1 text-left capitalize text-red-800 dark:text-red-400">
                                        <Info
                                            title={featureDetails.resourcePluralName}
                                            text={featureDetails.description}
                                            footer={`${quota} available in this plan`}
                                        />
                                        <span>{featureDetails.resourcePluralName}</span>
                                    </div>
                                    <DashedLine />
                                    <div className="flex-shrink-0 text-right">
                                        <FeatureBadge quota={quota} />
                                    </div>
                                </div>
                                <div className="dark:bg-red-800 dark:text-white relative mt-2 rounded-md text-red-800 border-2 border-red-800 p-2 text-center text-sm ">
                                    <div className=" absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[8px] border-b-[8px] border-l-[8px] border-r-transparent border-b-red-800 border-l-transparent"></div>
                                    Your current usage: {exceededFeature.used}
                                </div>
                            </div>
                        );
                    })}
                    {flags.map((flag) => {
                        const flagDetails = priceTierFlags[flag.id];
                        const isEnabled = props.tier.flags.find((f) => f.id === flag.id)?.isEnabled ?? false;
                        return (
                            <div key={flag.id} className="flex flex-row items-center gap-1">
                                <div
                                    className={`${isEnabled ? enabledTextColor : disabledTextColor} flex-shrink-0 flex flex-row items-center gap-1 text-left capitalize`}
                                >
                                    <Info
                                        title={flagDetails.resourcePluralName}
                                        text={flagDetails.description}
                                        footer={isEnabled ? 'Available in this plan' : 'Not available in this plan'}
                                    />
                                    <span>{flagDetails.resourcePluralName}</span>
                                </div>
                                <DashedLine />
                                <div className="flex-shrink-0 text-right">
                                    <div className="flex-shrink-0 text-right">
                                        <FeatureBadge quota={isEnabled} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            {props.footerCta && <CardFooter>{props.footerCta}</CardFooter>}
        </Card>
    );
}

export const getCurrentPlanCardCustomizations = (): CardCustomizations => {
    return {
        containerStyle: 'border-2 border-blue-700',
        badgeStyle: 'bg-blue-800',
        badgeText: 'Your current plan',
    };
};

export const getExceededPlanCardCustomizations = (): CardCustomizations => {
    return {
        containerStyle: 'border-2 border-red-800 bg-gray-100 dark:bg-gray-800',
        badgeStyle: 'bg-red-800',
        badgeText: 'Does not fit your current usage',
    };
};

export const Info = (props: { title: string; text: string; footer: string }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <InfoIcon className="cursor-pointer" size="14" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold capitalize">{props.title}</h4>
                        <p className="text-sm">{props.text}</p>
                        <div className="text-muted-foreground text-xs space-y-2">{props.footer}</div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};
