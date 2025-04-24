import { z } from 'zod';
import { env } from '~/env';

import { type PriceTierFeatureId } from '~/domain/price-tier-features';
import { type PriceTierFlagId } from '~/domain/price-tier-flags';

export const PriceTierIdSchema = z.union([
    z.literal('start'),
    z.literal('start2'),
    z.literal('pro'),
    z.literal('enterprise'),
    z.literal('custom1'),
]);

export type PriceTierId = z.infer<typeof PriceTierIdSchema>;

export const defaultTier: PriceTierId = 'start';

export type Feature = { id: PriceTierFeatureId; quota: number };
export type Flag = { id: PriceTierFlagId; isEnabled: boolean };

export type PriceTier = {
    id: PriceTierId;
    name: string;
    stripePriceId?: string;
    description: string;
    monthlyUsdPrice: number;
    yearlyUsdPrice: number;
    features: Feature[];
    flags: Flag[];
    isPopular: boolean;
    isPublic: boolean;
};

export const priceTiers: Record<PriceTierId, PriceTier> = {
    start: {
        id: 'start',
        name: 'Starter',
        description: 'Takes a minute to get started',
        monthlyUsdPrice: 0,
        yearlyUsdPrice: 0,
        isPublic: true,
        isPopular: false,
        features: [
            { id: 'locations', quota: 1 },
            { id: 'menus', quota: 1 },
            { id: 'menuItems', quota: 10 },
        ],
        flags: [{ id: 'reports', isEnabled: false }],
    },
    start2: {
        id: 'start2',
        name: 'Starter2',
        description: 'Takes two minutes to get started',
        monthlyUsdPrice: 0,
        yearlyUsdPrice: 0,
        isPublic: true,
        isPopular: false,
        features: [
            { id: 'locations', quota: 1 },
            { id: 'menus', quota: 1 },
            { id: 'menuItems', quota: 0 },
        ],
        flags: [{ id: 'reports', isEnabled: true }],
    },
    pro: {
        id: 'pro',
        name: 'Premium',
        description: 'Perfect for most',
        stripePriceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_TIER,
        monthlyUsdPrice: 6,
        yearlyUsdPrice: 5,
        isPublic: true,
        isPopular: true,
        features: [
            { id: 'locations', quota: 1 },
            { id: 'menus', quota: 1 },
            { id: 'menuItems', quota: 0 },
        ],
        flags: [{ id: 'reports', isEnabled: true }],
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Ready for large businesses',
        stripePriceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_TIER,
        monthlyUsdPrice: 59,
        yearlyUsdPrice: 5900,
        isPublic: true,
        isPopular: false,
        features: [
            { id: 'locations', quota: 1 },
            { id: 'menus', quota: 100 },
            { id: 'menuItems', quota: 0 },
        ],
        flags: [{ id: 'reports', isEnabled: true }],
    },
    custom1: {
        id: 'custom1',
        name: 'Custom 1',
        description: 'A custom plan',
        monthlyUsdPrice: -1,
        yearlyUsdPrice: -1,
        isPublic: false,
        isPopular: false,
        features: [],
        flags: [],
    },
};

export type PriceTierChangeScenario =
    | 'free-to-paid'
    | 'free-to-free'
    | 'paid-to-free'
    | 'paid-to-paid-upgrade'
    | 'paid-to-paid-downgrade';
