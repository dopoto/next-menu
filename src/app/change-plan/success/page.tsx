import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { env } from "~/env";
import Stripe from "stripe";
import { isPriceTierId } from "~/app/_domain/price-tiers";
import { getPriceTierChangeScenario } from "~/app/_utils/price-tier-utils";
import { updateCustomerByClerkUserId } from "~/server/queries";
import { BoxError } from "~/app/_components/BoxError";
import { CardSuccess } from "~/app/_components/CardSuccess";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"session_id", string | undefined>>;

export default async function SuccessPage(props: {
  searchParams: SearchParams;
}) {
  let isSuccess = false;

  try {
    const { session_id: sessionId } = await props.searchParams;

    if (!sessionId) {
      // TODO
      return "Error no session id";
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { userId, sessionClaims } = await auth();

    if (!session) {
      return "Error no session";
    }

    if (!userId) {
      return "Error no user id";
    }

    const stripeCustomerId = session.customer;

    if (!stripeCustomerId) {
      return "Error no customer id";
    }
    if (typeof stripeCustomerId !== "string") {
      return "Error unexpected format for Stripe customer id";
    }

    console.log("Customer ID:", stripeCustomerId);

    const newTierId = session.metadata?.tierId;

    if (!isPriceTierId(newTierId)) {
      //TODO parse
      return "Error no or invalid new tier";
    }

    const currentTierId = sessionClaims?.metadata?.tier;
    if (!isPriceTierId(currentTierId)) {
      //TODO parse
      return "Error no or invalid current tier";
    }

    const priceTierChangeScenario = getPriceTierChangeScenario(
      currentTierId,
      newTierId,
    );

    // Update our database (in case user moved from paid to free, we'll 
    // just delete their Stripe customer id from our records).
    const stripeCustomerIdOrNull =
      priceTierChangeScenario === "free-to-paid" ? null : stripeCustomerId;
    await updateCustomerByClerkUserId(userId, stripeCustomerIdOrNull);

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { tier: newTierId },
    });

    isSuccess = true;
  } catch (e) {
    return "Error generakl";
  }

  const mainComponent = isSuccess ? (
    <div>TODO show prev tier arrow current tier</div>
  ) : (
    <BoxError errorTypeId={"CHANGE_PLAN_ERROR"} />
  );

  const title = isSuccess ? "Thank you!" : "Err";
  const subtitle = isSuccess ? "Your subscription has been updated." : "Err";

  // let sessionStatus = "unknown";
  // let tierName = "";
  // let title = "Subscription Updated Successfully!";
  // let message = "Your subscription has been updated.";

  // // Handle other success scenarios based on the action parameter
  // else if (action === "upgrade") {
  //   title = "Upgrade Successful!";
  //   message =
  //     "Your subscription has been upgraded. The new features are now available.";
  // } else if (action === "downgrade") {
  //   title = "Downgrade Scheduled";
  //   message =
  //     "Your subscription will be downgraded at the end of your current billing cycle.";
  // } else if (action === "cancel") {
  //   title = "Cancellation Successful";
  //   message =
  //     "Your subscription has been canceled. You will be downgraded to the Free plan at the end of your current billing cycle.";
  // }

  // return (
  //   <SplitScreenContainer
  //     mainComponent={
  //       <Card className="text-center">
  //         <CardHeader>
  //           <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
  //             <CheckCircle2 className="h-6 w-6 text-green-600" />
  //           </div>
  //           <CardTitle className="text-2xl">{title}</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <p className="mb-4">{message}</p>
  //           <p className="text-muted-foreground">
  //             You will receive an email confirmation shortly with all the
  //             details.
  //           </p>
  //         </CardContent>
  //         <CardFooter className="flex justify-center">
  //           <Link href="/my">
  //             <Button>Go to My Account</Button>
  //           </Link>
  //         </CardFooter>
  //       </Card>
  //     }
  //     title="Thank You!"
  //     subtitle="Your subscription has been updated"
  //   />
  // );
  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      title={title}
      subtitle={subtitle}
    />
  );
}
