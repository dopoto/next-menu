import React from 'react';
import { GetStartedCta } from '../../_components/GetStartedCta';
import { PriceTierCard, type CardCustomizations } from '../../_components/PriceTierCard';
import { sections } from '../../_domain/landing-content';
import { priceTiers } from '../../_domain/price-tiers';
import { LandingSectionTitle } from './LandingSectionTitle';

export const LandingPricing: React.FC = () => {
    const { label, title, secondary } = sections.pricing!.header;
    return (
        <div className="bg-background py-16" id="pricing">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
                    {Object.entries(priceTiers).map(([, tier]) => {
                        if (!tier.isPublic) {
                            return null;
                        }
                        const cardCustomizations: CardCustomizations | undefined = tier.isPopular
                            ? {
                                  containerStyle: ' ',
                                  badgeStyle: 'bg-yellow-600',
                                  badgeText: 'Our most popular plan!',
                              }
                            : undefined;
                        return (
                            <PriceTierCard
                                key={tier.name}
                                tier={tier}
                                cardCustomizations={cardCustomizations}
                                footerCta={<GetStartedCta tier={tier.id} variant={'default'} />}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
