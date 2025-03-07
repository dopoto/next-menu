import { z } from "zod";
import { env } from "~/env";

export const PriceTierIdSchema = z.union([
  z.literal("start"),
  z.literal("pro"),
  z.literal("enterprise"),
  z.literal("custom1"),
]);

export type PriceTierId = z.infer<typeof PriceTierIdSchema>;

export const defaultTier: PriceTierId = 'start'

export type PriceTier = {
  id: PriceTierId,
  name: string;
  stripePriceId?: string;
  description: string;
  monthlyUsdPrice: number;
  yearlyUsdPrice: number;
  locations: number;
  menus: number;
  staffMembers: number;
  isPopular: boolean;
  isPublic: boolean;
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
    isPublic: true,
    isPopular: false
  },
  pro: {
    id: "pro",
    name: "Premium",
    stripePriceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_TIER,
    description: "Perfect for most",
    locations: 5,
    menus: 10,
    staffMembers: 10,
    monthlyUsdPrice: 6,
    yearlyUsdPrice: 5,
    isPublic: true,
    isPopular: true
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Ready for large businesses",
    locations: 100,
    menus: 100,
    staffMembers: 100,
    monthlyUsdPrice: 59,
    yearlyUsdPrice: 5900,
    isPublic: true,
    isPopular: false
  },
  custom1: {
    id: "custom1",
    name: "Custom 1",
    description: "A custom plan",
    locations: -1,
    menus: -1,
    staffMembers: -1,
    monthlyUsdPrice: -1,
    yearlyUsdPrice: -1,
    isPublic: false,
    isPopular: false
  },
};
