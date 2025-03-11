import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { env } from "~/env";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { isPriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { obj2str } from "~/app/_utils/string-utils";
import { getCustomerByOrgId } from "~/server/queries";
import { type ReactNode } from "react";
import { PlanChanged } from "../_components/PlanChanged";
import { BoxError } from "~/app/_components/BoxError";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"toTierId", string | undefined>>;

export default async function PaidToFreePage(props: {
  searchParams: SearchParams;
}) {
  let title = "";
  let subtitle = "";
  let mainComponent: ReactNode = <>Processing your request...</>;

  try {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
      redirect("/sign-in");
    }

    // Ensure we change from a paid tier
    if (!isPriceTierId(sessionClaims?.metadata?.tier)) {
      throw new Error(
        `Missing or invalid From tier in sessionClaims?.metadata: ${obj2str(sessionClaims)}`,
      );
    }
    const parsedFromTier = priceTiers[sessionClaims?.metadata?.tier];
    if (parsedFromTier.monthlyUsdPrice <= 0) {
      throw new Error(
        `Expected to move from a paid tier. Got: ${obj2str(parsedFromTier)}`,
      );
    }

    // Ensure we change to a free tier
    const { toTierId } = await props.searchParams;
    if (!isPriceTierId(toTierId)) {
      throw new Error(
        `Missing or invalid To tier param: ${toTierId?.toString()}`,
      );
    }
    const parsedToTier = priceTiers[toTierId];
    if (parsedToTier.monthlyUsdPrice > 0) {
      throw new Error(
        `Expected to move to a free tier. Got: ${obj2str(parsedToTier)}`,
      );
    }

    const stripeCustomerId = (await getCustomerByOrgId(orgId)).stripeCustomerId;
    if (!stripeCustomerId) {
      throw new Error(`Cannot find Stripe customer for organization ${orgId}`);
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    const orgSubscriptions = subscriptions.data.filter(
      (sub) => sub.metadata.orgId === orgId,
    );

    if (orgSubscriptions.length === 0) {
      throw new Error("No active subscription found for this organization");
    }

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
        `First item id (currentSubscription?.items?.data?.[0]?.id) not found for subscription ${obj2str(currentSubscription)}`,
      );
    }

    console.log(obj2str(currentSubscription));

    // await stripe.subscriptions.update(currentSubscription.id, {
    //   cancel_at_period_end: false,
    //   metadata: {
    //     ...currentSubscription.metadata,
    //     pendingDowngradeToFree: "true",
    //   },
    // });

    // TODO update JWT token

    // TODO update db

    title = "Thank you!";
    subtitle = "Your subscription has been updated.";
    mainComponent = (
      <PlanChanged fromTier={parsedFromTier} toTier={parsedToTier} />
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
