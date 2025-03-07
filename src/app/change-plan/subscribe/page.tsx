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
  Record<"targetTierId", string | string[] | undefined>
>;

export default async function SubscribePage(props: {
  searchParams: SearchParams;
}) {
  // Get the authenticated user
  const authResult = await auth();
  const userId = authResult.userId;
  const orgId = authResult.orgId;
  
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Validate the target tier ID
  const searchParams = await props.searchParams;
  const { targetTierId } = searchParams;
  if (!targetTierId) {
    redirect("/change-plan");
  }

  const parsedTierId = PriceTierIdSchema.safeParse(targetTierId);
  if (!parsedTierId.success) {
    redirect("/change-plan");
  }

  try {
    // Get the price ID
    const tier = priceTiers[parsedTierId.data];
    const priceId = tier.stripePriceId;
    if (!priceId) {
      throw new Error("No price ID found for this tier");
    }

    // const subscriptions2 = await stripe.subscriptions.list({
    //   customer: orgId,
    // });

    // Find subscriptions for this organization
    const subscriptions = await stripe.subscriptions.list({
      limit: 10,
      expand: ["data.default_payment_method"],
    });

    // Filter subscriptions to find ones with matching orgId in metadata
    const orgSubscriptions = subscriptions.data.filter(
      (sub) => sub.metadata.orgId === orgId,
    );

    // Create a checkout session using the organization ID
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   // Use client_reference_id for organization ID instead of customer
    //   client_reference_id: orgId,
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "subscription",
    //   success_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan`,
    //   subscription_data: {
    //     metadata: {
    //       userId,
    //       orgId,
    //       tierId: targetTierId,
    //     },
    //   },
    // });

    // // Redirect to Stripe checkout
    // if (session.url) {
    //   redirect(session.url);
    // }
  } catch (error) {
    console.error("Error creating checkout session:", error);
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
            <p>There was an error processing your subscription request. Please try again later.</p>
          </CardContent>
        </Card>
      }
      title="Subscribe"
      subtitle="Processing your subscription"
    />
  );
} 