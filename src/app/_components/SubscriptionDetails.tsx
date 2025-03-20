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

  if (parsedTier && isFreePriceTier(parsedTier.id)) {
    return (
      <OverviewCard
        title={"Subscription details"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled label={"Price"} text={"Free"} />
              </div>
            ),
          },
        ]}
        variant="neutral"
      />
    );
  }

  if (parsedTier && isPaidPriceTier(parsedTier.id)) {
    const stripeCustomerId = (await getCustomerByOrgId(orgId))
      .stripeCustomerId as StripeCustomerId;
    const stripeSub = await getActiveStripeSubscription(stripeCustomerId);
    const subId = stripeSub?.id?.toString() ?? "--";
    const currentPeriodEnd = stripeSub?.current_period_end
      ? new Date(stripeSub?.current_period_end * 1000).toLocaleDateString()
      : "--";

    return (
      <OverviewCard
        title={"Subscription details"}
        sections={[
          {
            title: "",
            content: (
              <div className="mt-2 flex flex-col flex-nowrap gap-2">
                <Labeled label={"Subscription Id"} text={subId} />
                <Labeled label={"Renewal date"} text={currentPeriodEnd} />
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
