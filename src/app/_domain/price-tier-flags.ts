import { z } from "zod";

export const PriceTierFlagIdSchema = z.literal("reports")

export type PriceTierFlagId = z.infer<typeof PriceTierFlagIdSchema>;

export type PriceTierFlag = {
  id: PriceTierFlagId;
  /**
   * @example "report"
   */
  resourceSingularName: string;
  /**
   * @example "reports"
   */
  resourcePluralName: string;
};

export const priceTierFlags: Record<PriceTierFlagId, PriceTierFlag> = {
  reports: {
    id: "reports",
    resourceSingularName: "report",
    resourcePluralName: "reports",
  },
};
