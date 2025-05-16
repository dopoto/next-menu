import { type PriceTierId } from './price-tiers';

export interface CustomJwtSessionClaims {
    metadata?: {
        tier?: PriceTierId;
        orgId?: string;
        orgName?: string;
    };
}
