import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { PriceTierIdSchema, priceTiers } from "~/app/_domain/price-tiers";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"toTierId", string | string[] | undefined>>;

export default async function SubscribePage(props: {
  searchParams: SearchParams;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Validate params
  const searchParams = await props.searchParams;
  const { toTierId } = searchParams;
  if (!toTierId) {
    redirect("/change-plan");
  }

  const parsedToTierId = PriceTierIdSchema.safeParse(toTierId);
  if (!parsedToTierId.success) {
    redirect("/change-plan");
  }

  let stripeSessionUrl = "";

  try {
    const parsedToTier = priceTiers[parsedToTierId.data];
    const newTierStripePriceId = parsedToTier.stripePriceId;
    if (!newTierStripePriceId) {
      throw new Error("No price ID found for this tier");
    }

    /*
    TODO handle edge case where the user had a paid tier, went to free, and now is moving back to 
    paid tier, since maybe in this case they should have a Stripe subscription?
    */

    const stripeSession = await stripe.checkout.sessions.create({
      client_reference_id: orgId,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/success?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price: newTierStripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        userId: userId,
        orgId: orgId,
        tierId: parsedToTier.id,
      },
    });

    stripeSessionUrl = stripeSession.url ?? "";
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }

  if (stripeSessionUrl !== "") {
    redirect(stripeSessionUrl);
  } else {
    //TODO Show error
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
              There was an error processing your subscription request. Please
              try again later.
            </p>
          </CardContent>
        </Card>
      }
      title="Subscribe"
      subtitle="Processing your subscription"
    />
  );
}
