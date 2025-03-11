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
import { Suspense } from "react";
import ProcessingPlanChange from "../_components/ProcessingPlanChange";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<"toTierId", string | undefined>>;

export default async function PaidToFreePage(props: {
  searchParams: SearchParams;
}) {
  let title = "";
  let subtitle = "";
  let mainComponent: ReactNode;
  let progress = 0;

  return (
    <Suspense fallback={<ProcessingPlanChange progress={0} />}>
      <Step1 />
    </Suspense>
  );
}

async function Step1() {
  console.log("Step1 start");
  try {
    const updateProgress = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Step1 updateProgress ");
          resolve(null);
        }, 2000);
      });
    };
    console.log("Step1   bef upda");
    await updateProgress();
    console.log("Step1   after  upda");
    const result1 = "res 1";

    return (
      <Suspense fallback={<ProcessingPlanChange progress={40} />}>
        <Step2 step1Result={result1} />
      </Suspense>
    );
  } catch (error) {
    throw new Error("Step 1 failed", { cause: error });
  }
}

async function Step2(props: { step1Result: string }) {
  try {
    const updateProgress = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 2000);
      });
    };
    await updateProgress();
    const result2 = "res 2";
    return (
      <Suspense fallback={<ProcessingPlanChange progress={90} />}>
        <FinalStep step2Result={result2} />
      </Suspense>
    );
  } catch (error) {
    throw new Error("Step 1 failed", { cause: error });
  }
}

async function FinalStep(props: { step2Result: string }) {
  const updateProgress = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
  };
  await updateProgress();
  
  // Throw ContextError directly instead of wrapping it
  throw new Error("Final step failed");
  
  return (
    <SplitScreenContainer
      title={`Thank you! [${props.step2Result}]`}
      subtitle="Your subscription has been updated."
      mainComponent={<p>Ready!</p>}
    />
  );
}

/*
export default async function PaidToFreePage(props: {
  searchParams: SearchParams;
}) {
  let title = "";
  let subtitle = "";
  let mainComponent: ReactNode;
  let progress = 0;

  // Function to simulate progress updates
  const updateProgress = (newProgress: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        progress = newProgress;
        resolve(null);
      }, 100); // Adjust the delay as needed
    });
  };

  try {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
      redirect("/sign-in");
    }

    await updateProgress(10);
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

    await updateProgress(20);
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

    await updateProgress(30);
    const stripeCustomerId = (await getCustomerByOrgId(orgId)).stripeCustomerId;
    if (!stripeCustomerId) {
      throw new Error(`Cannot find Stripe customer for organization ${orgId}`);
    }

    await updateProgress(50);
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    await updateProgress(70);
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

    const currentSubscription = subscriptions.data[0];

    if (!currentSubscription?.items?.data?.[0]?.id) {
      throw new Error(
        `First item id (currentSubscription?.items?.data?.[0]?.id) not found for subscription ${obj2str(currentSubscription)}`,
      );
    }

    await updateProgress(90);
    title = "Thank you!";
    subtitle = "Your subscription has been updated.";
    mainComponent = (
      <PlanChanged fromTier={parsedFromTier} toTier={parsedToTier} />
    );
  } catch (e) {
    title = "Could not update your subscription";
    subtitle = "An error occurred while processing the update.";
    const errorContext = { message: (e as Error).message ?? '' }
    mainComponent = <BoxError errorTypeId={"CHANGE_PLAN_ERROR"} context={errorContext} />;
  }

  return (
    <Suspense fallback={<Loading progress={progress} />}>
      <SplitScreenContainer
        mainComponent={mainComponent || <Loading progress={progress} />}
        title={title || 'Processing your plan change'}
        subtitle={subtitle || 'This should be done in a sec...'}
      />
    </Suspense>
  );
}
*/
