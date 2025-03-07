import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { env } from "~/env";
import Stripe from "stripe";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = {
  session_id?: string;
  action?: string;
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId, action } = searchParams;
  let sessionStatus = "unknown";
  let tierName = "";
  let title = "Subscription Updated Successfully!";
  let message = "Your subscription has been updated.";
  
  // If we have a session ID, get details from Stripe
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      sessionStatus = session.status ?? "unknown";
      
      // Get the subscription details if available
      if (session.subscription && typeof session.subscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        
        // Get the product name from the subscription
        if (subscription.items.data[0]?.price.product) {
          const productId = 
            typeof subscription.items.data[0].price.product === "string"
              ? subscription.items.data[0].price.product
              : subscription.items.data[0].price.product.id;
              
          const product = await stripe.products.retrieve(productId);
          tierName = product.name;
          message = `Your subscription to ${tierName} has been activated successfully.`;
        }
      }
    } catch (error) {
      console.error("Error retrieving session:", error);
    }
  } 
  // Handle other success scenarios based on the action parameter
  else if (action === "upgrade") {
    title = "Upgrade Successful!";
    message = "Your subscription has been upgraded. The new features are now available.";
  } 
  else if (action === "downgrade") {
    title = "Downgrade Scheduled";
    message = "Your subscription will be downgraded at the end of your current billing cycle.";
  } 
  else if (action === "cancel") {
    title = "Cancellation Successful";
    message = "Your subscription has been canceled. You will be downgraded to the Free plan at the end of your current billing cycle.";
  }
  
  return (
    <SplitScreenContainer
      mainComponent={
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{message}</p>
            <p className="text-muted-foreground">
              You will receive an email confirmation shortly with all the details.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/my">
              <Button>Go to My Account</Button>
            </Link>
          </CardFooter>
        </Card>
      }
      title="Thank You!"
      subtitle="Your subscription has been updated"
    />
  );
} 