import { sections } from "../_domain/landing-content";
import { priceTiers } from "../_domain/price-tiers";
import { LandingSectionTitle } from "./LandingSectionTitle";
import { PriceTierCard, type CardCustomizations } from "./PriceTierCard";
import { PricingCardCta } from "./PricingCardCta";

export const LandingPricing: React.FC = () => {
  const { label, title, secondary } = sections.pricing!.header;
  return (
    <div className="bg-background py-16" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionTitle
          label={label}
          title={title}
          secondary={secondary}
        />
        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {Object.entries(priceTiers).map(([_, tier]) => {
            //TODO Ctas, customization

            const cardCustomizations: CardCustomizations | undefined =
              tier.isPopular
                ? {
                    containerStyle: " ",
                    badgeStyle: "bg-red-700",
                    badgeText: "Our most popular plan!",
                  }
                : undefined;
            console.log(cardCustomizations);
            return tier.isPublic ? (
              <PriceTierCard
                key={tier.name}
                tier={tier}
                cardCustomizations={cardCustomizations}
                // footerCta = {<PricingCardCta tierId={tier.id} />}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};
