import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default async function CancelSubscriptionPage() {
  // Get the authenticated user and organization
  const authResult = await auth();
  const userId = authResult.userId;
  const orgId = authResult.orgId;
  
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  try {
    // Find subscriptions for this organization
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

    // Cancel the subscription at the end of the billing period
    if (subscription) {
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
        metadata: {
          ...subscription.metadata,
          pendingDowngradeToFree: "true",
        },
      });
    }

    // Redirect to success page with action parameter
    redirect("/change-plan/success?action=cancel");
  } catch (error) {
    console.error("Error canceling subscription:", error);
  }

  // If there was an error or no redirect happened
  return (
    <SplitScreenContainer
      mainComponent={
        <Card>
          <CardHeader>
            <CardTitle>Cancellation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error processing your cancellation request. Please try again later.</p>
          </CardContent>
        </Card>
      }
      title="Cancel Subscription"
      subtitle="Processing your cancellation"
    />
  );
} 