import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { PriceTierIdSchema, priceTiers } from "~/app/_domain/price-tiers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { getCustomerByOrgId } from "~/server/queries";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<
  Record<"targetTierId" | "isUpgrade", string | string[] | undefined>
>;

export default async function ModifySubscriptionPage(props: {
  searchParams: SearchParams;
}) {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Validate params
  const searchParams = await props.searchParams;
  const { targetTierId, isUpgrade: isUpgradeStr } = searchParams;
  if (!targetTierId) {
    redirect("/change-plan");
  }

  const parsedTargetTierId = PriceTierIdSchema.safeParse(targetTierId);
  if (!parsedTargetTierId.success) {
    redirect("/change-plan");
  }

  // Parse isUpgrade
  const isUpgrade = isUpgradeStr === "true";

  try {
    // Get the price ID
    const parsedTargetTier = priceTiers[parsedTargetTierId.data];
    console.log(`parsedTargetTier: ${JSON.stringify(parsedTargetTier)}`);
    const newPriceId = parsedTargetTier.stripePriceId;
    if (!newPriceId) {
      throw new Error("No price ID found for this tier");
    }

    const stripeCustomerId = (await getCustomerByOrgId(orgId)).stripeCustomerId;

    if (!stripeCustomerId) {
      // TODO handle with custom error
      throw new Error("Cannot find stripe cust id");
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    });

    console.log(`orgId: ${orgId}`);
    console.log(`subs: ${JSON.stringify(subscriptions, null, 2)}`);

    console.log(`org subs: ${JSON.stringify(subscriptions)}`);

    if (!subscriptions || subscriptions.data.length === 0) {
      throw new Error("No active subscription found for this organization");
    }

    if (subscriptions.data.length > 1) {
      throw new Error("More than 1 subscription found for this organization");
    }

    // Get the first active subscription
    // TODO more filters here
    const currentSubscription = subscriptions.data[0];

    // Update the subscription
    if (currentSubscription?.items?.data?.[0]?.id) {
      await stripe.subscriptions.update(currentSubscription.id, {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        // For upgrades, prorate immediately and create an invoice
        // For downgrades, apply at the end of the billing period
        proration_behavior: isUpgrade ? "always_invoice" : "none",
        metadata: {
          orgId,
          userId,
          tierId: parsedTargetTier.id,
        },
      });
    }

    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {...(sessionClaims?.metadata ?? {}), tier: parsedTargetTier.id},
    });

    // Redirect to success page with appropriate action parameter
    const successAction = isUpgrade ? "upgrade" : "downgrade";
    redirect(`/change-plan/success?action=${successAction}`);
  } catch (error) {
    console.error("Error updating subscription:", error);
  }

  // If there was an error or no redirect happened
  return (
    <SplitScreenContainer
      mainComponent={
        <Card>
          <CardHeader>
            <CardTitle>Subscription Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              There was an error processing your subscription change. Please try
              again later.
            </p>
          </CardContent>
        </Card>
      }
      title="Modify Subscription"
      subtitle="Processing your subscription change"
    />
  );
}
