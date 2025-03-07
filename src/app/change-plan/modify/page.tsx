import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { PriceTierIdSchema, priceTiers } from "~/app/_domain/price-tiers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<
  Record<"targetTierId" | "isUpgrade", string | string[] | undefined>
>;

export default async function ModifySubscriptionPage(props: {
  searchParams: SearchParams;
}) {
  // Get the authenticated user and organization
  const authResult = await auth();
  const userId = authResult.userId;
  const orgId = authResult.orgId;
  
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Validate params
  const searchParams = await props.searchParams;
  const { targetTierId, isUpgrade: isUpgradeStr } = searchParams;
  if (!targetTierId) {
    redirect("/change-plan");
  }

  const parsedTierId = PriceTierIdSchema.safeParse(targetTierId);
  if (!parsedTierId.success) {
    redirect("/change-plan");
  }

  // Parse isUpgrade
  const isUpgrade = isUpgradeStr === "true";

  try {
    // Get the price ID
    const tier = priceTiers[parsedTierId.data];
    const newPriceId = tier.stripePriceId;
    if (!newPriceId) {
      throw new Error("No price ID found for this tier");
    }

    // Find subscriptions for this organization
    // Since we're using client_reference_id instead of customer ID,
    // we need to search for subscriptions by metadata
    const subscriptions = await stripe.subscriptions.list({
      limit: 10, // Limit results to keep query fast
      expand: ['data.default_payment_method'],
    });
    
    // Filter subscriptions to find ones with matching orgId in metadata
    const orgSubscriptions = subscriptions.data.filter(
      sub => sub.metadata.orgId === orgId
    );

    if (orgSubscriptions.length === 0) {
      throw new Error("No active subscription found for this organization");
    }

    // Get the first active subscription
    const subscription = orgSubscriptions[0];

    // Update the subscription
    if (subscription?.items?.data?.[0]?.id) {
      await stripe.subscriptions.update(subscription.id, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        // For upgrades, prorate immediately and create an invoice
        // For downgrades, apply at the end of the billing period
        proration_behavior: isUpgrade ? "always_invoice" : "none",
        metadata: {
          orgId,
          userId,
          tierId: targetTierId,
        },
      });
    }

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
            <p>There was an error processing your subscription change. Please try again later.</p>
          </CardContent>
        </Card>
      }
      title="Modify Subscription"
      subtitle="Processing your subscription change"
    />
  );
} 