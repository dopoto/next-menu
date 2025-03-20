import React from "react";
import { Labeled } from "./Labeled";
import { OverviewCard } from "./OverviewCard";
import type { StripeCustomerId } from "../_domain/stripe";
import { getActiveStripeSubscription } from "../_utils/stripe-utils";
import { auth } from "@clerk/nextjs/server";
import { getCustomerByOrgId } from "~/server/queries";
import {
  getValidPriceTier,
  isFreePriceTier,
  isPaidPriceTier,
} from "../_utils/price-tier-utils";

export async function SubscriptionDetails() {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No orgId found in auth.`);
  }

  const tierId = sessionClaims?.metadata.tier;
  const parsedTier = getValidPriceTier(tierId);


  //TODO
  /**
   *    PLAN
   * 
   * Name \: premuim
   * Price 
   * Next billing period/ if paid
   * Organization
   * 
   */

  if (parsedTier && isPaidPriceTier(parsedTier.id)) {
    const stripeCustomerId = (await getCustomerByOrgId(orgId))
      .stripeCustomerId as StripeCustomerId;
    const stripeSub = await getActiveStripeSubscription(stripeCustomerId);
    const subPrice = `USD ${parsedTier.monthlyUsdPrice.toFixed(2)}/month`;
    const currentPeriodEnd = stripeSub?.current_period_end
      ? new Date(stripeSub?.current_period_end * 1000).toLocaleDateString()
      : "--";

    //TODO More stripe info - invoices, email ?
    
    return (
      <OverviewCard
        title={"Subscription"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled label={"Price"} text={subPrice} />
                <Labeled
                  label={"NEXT BILLING PERIOD START"}
                  text={currentPeriodEnd}
                />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
    );
  }

  if (parsedTier && isFreePriceTier(parsedTier.id)) {
    return (
      <OverviewCard
        title={"Subscription"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled label={"Price"} text="FREE" />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
    );
  }

  return null;
}
