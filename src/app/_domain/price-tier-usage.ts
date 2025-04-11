import { type PriceTierFeatureId } from "~/app/_domain/price-tier-features";
import {
  getLocationsPlanUsage,
  getMenusPlanUsage,
  getMenuItemsPlanUsage,
} from "~/server/queries";

export type PriceTierFeatureUsage = {
  id: PriceTierFeatureId;
  planQuota: number;
  used: number;
  available: number;
};

export const priceTierUsageFunctions: Record<
  PriceTierFeatureId,
  () => Promise<number>
> = {
  locations: getLocationsPlanUsage,
  menus: getMenusPlanUsage,
  menuItems: getMenuItemsPlanUsage,
};

export type ExceededFeature = PriceTierFeatureUsage & {
  candidateQuota?: number;
};
