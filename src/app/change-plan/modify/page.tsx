import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import {
  isPriceTierId,
  PriceTierIdSchema,
  priceTiers,
} from "~/app/_domain/price-tiers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { getCustomerByOrgId } from "~/server/queries";
import { BoxError } from "~/app/_components/BoxError";

// TODO How to handle JWT token update?
// metadata.tier only needs to be changed at the end of the current billing period

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"toTierId", string | string[] | undefined>>;

export default async function ModifySubscriptionPage(props: {
  searchParams: SearchParams;
}) {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  let successRedirectUrl = null;
  let title = "";
  let subtitle = "";
  let mainComponent = <>Processing your request...</>;

  try {
    if (!isPriceTierId(sessionClaims?.metadata?.tier)) {
      const dbg = JSON.stringify(sessionClaims?.metadata, null, 2);
      throw new Error(
        `Missing or invalid From tier in sessionClaims?.metadata: ${dbg}`,
      );
    }

    const { toTierId } = await props.searchParams;
    const parsedToTierId = PriceTierIdSchema.safeParse(toTierId);
    if (!parsedToTierId.success) {
      throw new Error(`Invalid toTierId param "${toTierId?.toString()}"`);
    }

    // Get the price ID
    const parsedToTier = priceTiers[parsedToTierId.data];

    const toTierStripePriceId = parsedToTier.stripePriceId;
    if (!toTierStripePriceId) {
      throw new Error(`No Stripe price ID found for tier ${parsedToTier.id}`);
    }

    const stripeCustomerId = (await getCustomerByOrgId(orgId)).stripeCustomerId;

    if (!stripeCustomerId) {
      throw new Error(`Cannot find Stripe customer for organization ${orgId}`);
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    });

    if (!subscriptions || subscriptions.data.length === 0) {
      throw new Error(`No active subscription found for organization ${orgId}`);
    }

    if (subscriptions.data.length > 1) {
      throw new Error(
        `More than 1 subscription found for organization ${orgId}`,
      );
    }

    // Get the first active subscription
    // TODO more filters here
    const currentSubscription = subscriptions.data[0];

    if (!currentSubscription?.items?.data?.[0]?.id) {
      throw new Error(
        `First item id (currentSubscription?.items?.data?.[0]?.id) not found for subscription ${JSON.stringify(currentSubscription, null, 2)}`,
      );
    }

    // Update the subscription
    await stripe.subscriptions.update(currentSubscription.id, {
      items: [
        {
          id: currentSubscription.items.data[0].id,
          price: toTierStripePriceId,
        },
      ],
      // Prorate immediately and create an invoice
      proration_behavior: "always_invoice",
      metadata: {
        orgId,
        userId,
        tierId: parsedToTier.id,
      },
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: toTierStripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan`,
      metadata: {
        orgId,
        userId,
        tierId: parsedToTier.id,
      },
    });

    successRedirectUrl = session.url;

  } catch {
    title = "Could not update your subscription";
    subtitle = "An error occurred while processing the update.";
    mainComponent = <BoxError errorTypeId={"CHANGE_PLAN_ERROR"} />;
  }

  if (successRedirectUrl) {
    redirect(successRedirectUrl);
  }

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      title={title}
      subtitle={subtitle}
    />
  );
}
