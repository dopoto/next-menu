import { priceTiers } from "../_domain/price-tiers";
import { PricingCard } from "./PricingCard";

export const Pricing: React.FC = () => {
  return (
    <div className="bg-background py-16" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading-label">
            Pricing
          </h2>
          <p className="heading-main">
            Plans for teams of all sizes
          </p>
          <p className="heading-secondary">
            {
              "Choose the perfect plan for your needs. Always know what you'll pay."
            }
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-8">
          {Object.entries(priceTiers).map(([_, tier]) => {
            return tier.isPublic ? <PricingCard key={tier.name} tier={tier} /> : null;
          })}
        </div>
      </div>
    </div>
  );
};
