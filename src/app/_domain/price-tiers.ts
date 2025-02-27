


type PriceTierId = "start" | "pro" | "custom";
export type PriceTier = {
  name: string;
  description: string;
  monthlyUsdPrice: number;
  yearlyUsdPrice: number;
  locations: number;
  menus: number;
  isEnabled: boolean;
};

export const priceTiers: Record<PriceTierId, PriceTier> = {
  start: {
    name: "Start",
    description: "Get started in minutes",
    locations: 1,
    menus: 1,
    monthlyUsdPrice: 0,
    yearlyUsdPrice: 0,
    isEnabled: true,
  },
  pro: {
    name: "Premium",
    description: "Perfect for most",
    locations: 10,
    menus: 10,
    monthlyUsdPrice: 6,
    yearlyUsdPrice: 5,
    isEnabled: false
  },
  custom: {
    name: "Enterprise",
    description: "Ready for large businesses",
    locations: -1,
    menus: -1,
    monthlyUsdPrice: -1,
    yearlyUsdPrice: -1,
    isEnabled: false
  },
};
