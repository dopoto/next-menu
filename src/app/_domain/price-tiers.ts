type PriceTierId = "start" | "pro" | "custom";

export type PriceTier = {
  name: string;
  description: string;
  monthlyUsdPrice: number;
  yearlyUsdPrice: number;
  locations: number;
  menus: number;
  staffMembers: number;
  isEnabled: boolean;
};

export const priceTiers: Record<PriceTierId, PriceTier> = {
  start: {
    name: "Starter",
    description: "Get started in minutes",
    locations: 1,
    menus: 1,
    staffMembers: 0,
    monthlyUsdPrice: 0,
    yearlyUsdPrice: 0,
    isEnabled: true,
  },
  pro: {
    name: "Premium",
    description: "Perfect for most",
    locations: 5,
    menus: 10,
    staffMembers: 10,
    monthlyUsdPrice: 6,
    yearlyUsdPrice: 5,
    isEnabled: false,
  },
  custom: {
    name: "Enterprise",
    description: "Ready for large businesses",
    locations: -1,
    menus: -1,
    staffMembers: -1,
    monthlyUsdPrice: -1,
    yearlyUsdPrice: -1,
    isEnabled: false,
  },
};
