import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { env } from "~/env";
import Stripe from "stripe";
import { isPriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { getPriceTierChangeScenario } from "~/app/_utils/price-tier-utils";
import { updateCustomerByClerkUserId } from "~/server/queries";
import { BoxError } from "~/app/_components/BoxError";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { PriceTierCard } from "~/app/_components/PriceTierCard";
import SvgIcon from "~/app/_components/SvgIcons";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"session_id", string | undefined>>;

export default async function SuccessPage(props: {
  searchParams: SearchParams;
}) {
  let title = "";
  let subtitle = "";
  let mainComponent = null;

  try {
    const { session_id: sessionId } = await props.searchParams;

    if (!sessionId) {
      throw new Error("No session_id param");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw new Error(
        `No Stripe session found for session_id param "${sessionId}"`,
      );
    }

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      throw new Error(`No Clerk user id found"`);
    }

    const stripeCustomerId = session.customer;

    if (!stripeCustomerId) {
      throw new Error(
        `No stripeCustomerId found in session ${JSON.stringify(session, null, 2)}`,
      );
    }
    if (typeof stripeCustomerId !== "string") {
      throw new Error(
        `Expected string format for Stripe customer id: ${JSON.stringify(stripeCustomerId, null, 2)}`,
      );
    }

    if (!isPriceTierId(session.metadata?.tierId)) {
      throw new Error(
        `Missing or invalid To tier in session.metadata: ${JSON.stringify(session, null, 2)}`,
      );
    }
    const parsedToTier = priceTiers[session.metadata?.tierId];

    if (!isPriceTierId(sessionClaims?.metadata?.tier)) {
      throw new Error(
        `Missing or invalid From tier in sessionClaims?.metadata: ${JSON.stringify(sessionClaims?.metadata, null, 2)}`,
      );
    }
    const parsedFromTier = priceTiers[sessionClaims?.metadata?.tier];

    const priceTierChangeScenario = getPriceTierChangeScenario(
      parsedFromTier.id,
      parsedToTier.id,
    );

    // Update our database (in case user moved from paid to free, we'll
    // just delete their Stripe customer id from our records).
    const stripeCustomerIdOrNull =
      priceTierChangeScenario === "free-to-paid" ? null : stripeCustomerId;
    await updateCustomerByClerkUserId(userId, stripeCustomerIdOrNull);

    // Update Clerk with new tier
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { tier: parsedToTier.id },
    });

    title = "Thank you!";
    subtitle = "Your subscription has been updated.";
    mainComponent = (
      <div className="flex flex-col flex-nowrap gap-4">
        <p className="pb-4 text-sm">TODO Desc?</p>
        <PriceTierCard tier={parsedFromTier} isCurrent={false} />
        <SvgIcon
          kind={"arrowDoodle"}
          className={
            "fill-gray-500 stroke-gray-500 dark:fill-gray-400 dark:stroke-gray-400"
          }
        />
        <PriceTierCard tier={parsedToTier} isCurrent={true} />
        <div className="flex w-full flex-col gap-2 pt-4">
          <Link href="/my" className="w-full">
            <Button variant="outline" className="w-full">
              Go back to my account
            </Button>
          </Link>
        </div>
      </div>
    );
  } catch(e ) {
    title = "Could not update your subscription";
    subtitle = "An error occurred while processing the update.";
    const errorContext = { message: (e as Error).message ?? '' }
    mainComponent = <BoxError errorTypeId={"CHANGE_PLAN_ERROR"} context={errorContext} />;
  }

  return (
    <SplitScreenContainer
      mainComponent={mainComponent}
      title={title}
      subtitle={subtitle}
    />
  );
}
