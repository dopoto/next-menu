import { priceTiers } from "../_domain/price-tiers";
import { PricingCard } from "./PricingCard";

export function Pricing() {
  return (
    <div className="grid grid-cols-1 gap-y-1.5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-y-0">
      {Object.entries(priceTiers).map(([_, tier]) => {
        return <PricingCard key={tier.name} tier={tier} />;
      })}
    </div>
  );
}
