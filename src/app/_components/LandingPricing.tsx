import { sections } from "../_domain/landing-content";
import { priceTiers } from "../_domain/price-tiers";
import { LandingSectionTitle } from "./LandingSectionTitle";
import { PricingCard } from "./PricingCard";

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
        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-8">
          {Object.entries(priceTiers).map(([_, tier]) => {
            return tier.isPublic ? <PricingCard key={tier.name} tier={tier} /> : null;
          })}
        </div>
      </div>
    </div>
  );
};
