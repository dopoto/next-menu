import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type PriceTier } from "~/app/_domain/price-tiers";
import { obj2str } from "~/app/_utils/string-utils";
import { PlanChanged } from "../_components/PlanChanged";
import { Suspense } from "react";
import ProcessingPlanChange from "../_components/ProcessingPlanChange";
import { getValidFreePriceTier } from "~/app/_utils/price-tier-utils";
import { getExceededFeatures } from "~/app/_utils/price-tier-utils.server-only";
import { ROUTES } from "~/app/_domain/routes";

type SearchParams = Promise<Record<"toTierId", string | undefined>>;

export default async function FreeToFreePage(props: {
  searchParams: SearchParams;
}) {
  const { toTierId } = await props.searchParams;
  return (
    <Suspense fallback={<ProcessingPlanChange progress={12} />}>
      <Step1 toTierId={toTierId} />
    </Suspense>
  );
}

async function Step1(props: { toTierId?: string }) {
  const { userId, orgId, sessionClaims } = await auth();
  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  // Expecting a valid free From tier:
  const parsedFreeFromTier = getValidFreePriceTier(
    sessionClaims?.metadata?.tier,
  );
  if (!parsedFreeFromTier) {
    throw new Error(
      `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
    );
  }

  // Expecting a valid free To tier:
  const parsedFreeToTier = getValidFreePriceTier(props.toTierId);
  if (!parsedFreeToTier) {
    throw new Error(
      `Missing or invalid To tier in props.toTierId. got: ${props.toTierId}`,
    );
  }

  // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
  const exceededFeatures = await getExceededFeatures(
    parsedFreeFromTier.id,
    parsedFreeToTier.id,
  );
  if (exceededFeatures?.length > 0) {
    return redirect(ROUTES.changePlan);
  }

  return (
    <Suspense fallback={<ProcessingPlanChange progress={40} />}>
      <FinalStep fromTier={parsedFreeFromTier} toTier={parsedFreeToTier} />
    </Suspense>
  );
}

async function FinalStep(props: { fromTier: PriceTier; toTier: PriceTier }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error(`No Clerk user id found"`);
  }

  // Update Clerk with new tier
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { tier: props.toTier.id },
  });

  return (
    <SplitScreenContainer
      title={`Change your plan`}
      subtitle="Your plan has been updated!"
      mainComponent={
        <PlanChanged fromTier={props.fromTier} toTier={props.toTier} />
      }
    />
  );
}
