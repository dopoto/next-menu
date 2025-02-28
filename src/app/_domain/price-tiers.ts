import { z } from "zod";

export const PriceTierIdSchema = z.union([
  z.literal("start"),
  z.literal("pro"),
  z.literal("custom"),
]);

export type PriceTierId = z.infer<typeof PriceTierIdSchema>;

export const defaultTier: PriceTierId = 'start'

export type PriceTier = {
  id: PriceTierId,
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
    id: "start",
    name: "Starter",
    description: "Takes a minute to get started",
    locations: 1,
    menus: 1,
    staffMembers: 0,
    monthlyUsdPrice: 0,
    yearlyUsdPrice: 0,
    isEnabled: true,

  },
  pro: {
    id: "pro",
    name: "Premium",
    description: "Perfect for most",
    locations: 5,
    menus: 10,
    staffMembers: 10,
    monthlyUsdPrice: 6,
    yearlyUsdPrice: 5,
    isEnabled: true,
  },
  custom: {
    id: "custom",
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
