import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import { OverviewCard } from "~/app/_components/OverviewCard";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { SubscriptionDetails } from "~/app/_components/SubscriptionDetails";
import { type PriceTierFeatureUsage } from "~/app/_domain/price-tier-features";
import { type PriceTier } from "~/app/_domain/price-tiers";
import { ROUTES } from "~/app/_domain/routes";
import { getValidPriceTier } from "~/app/_utils/price-tier-utils";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";
import { obj2str } from "~/app/_utils/string-utils";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default async function ViewPlanPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const tierId = sessionClaims?.metadata.tier;
  const parsedTier = getValidPriceTier(tierId);
  if (!parsedTier) {
    throw new Error(
      `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
    );
  }

  return (
    <SplitScreenContainer
      mainComponent={
        <>
          <Suspense fallback="Loading...">
            <SubscriptionDetails />
          </Suspense>
          <Suspense
            fallback={
              <OverviewCard
                title={"Plan usage"}
                sections={[
                  {
                    title: "",
                    content: (
                      <PlanUsageSkeleton rows={parsedTier.features.length} />
                    ),
                  },
                ]}
                variant="neutral"
              />
            }
          >
            <OverviewCard
              title={"Plan usage"}
              sections={[
                { title: "", content: <PlanUsage tier={parsedTier} /> },
              ]}
              variant="neutral"
            />
          </Suspense>
          <div className="flex w-full flex-col gap-2">
            <Link href={ROUTES.my} className="w-full">
              <Button variant="outline" className="w-full">
                Go back to my account
              </Button>
            </Link>
            <Link href={ROUTES.changePlan} className="w-full">
              <Button variant="outline" className="w-full">
                Change plan
              </Button>
            </Link>
          </div>
        </>
      }
      title={"Your plan"}
      subtitle={`You are currently on the ${parsedTier.name} plan.`}
    ></SplitScreenContainer>
  );
}

async function PlanUsage(props: { tier: PriceTier }) {
  const featuresInCurrentTier = props.tier.features;
  const featuresInCurrentTierWithUsage: PriceTierFeatureUsage[] =
    await Promise.all(
      featuresInCurrentTier.map(async (feature) => {
        const available = await getAvailableFeatureQuota(feature.id);
        return {
          id: feature.id,
          planQuota: feature.quota,
          available,
          used: feature.quota - available,
        };
      }),
    );

  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="">Feature</TableHead>
          <TableHead className="w-[75px] text-right">Included</TableHead>
          <TableHead className="w-[75px] text-right">Used</TableHead>
          <TableHead className="w-[75px] text-right">Available</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {featuresInCurrentTierWithUsage.map((feature) => (
          <TableRow key={feature.id}>
            <TableCell className="font-medium capitalize">
              {feature.id}
            </TableCell>
            <TableCell className="text-right">{feature.planQuota}</TableCell>
            <TableCell className="text-right">{feature.used}</TableCell>
            <TableCell className="text-right">
              {feature.planQuota - feature.used}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PlanUsageSkeleton(props: { rows: number }) {
  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="">Feature</TableHead>
          <TableHead className="w-[75px] text-right">Included</TableHead>
          <TableHead className="w-[75px] text-right">Used</TableHead>
          <TableHead className="w-[75px] text-right">Available</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(props.rows).keys()].map((row) => (
          <TableRow key={row}>
            <TableCell className="font-medium capitalize">
              <Skeleton className="h-[20px] w-[80px]" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-[20px] w-[30px]" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-[20px] w-[30px]" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-[20px] w-[30px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// function PlanBilling() {
//   return (
//     <Table className="mt-2">
//       <TableCaption>A list of your billing!!</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Invoice</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Method</TableHead>
//           <TableHead className="text-right">Amount</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         <TableRow>
//           <TableCell className="font-medium">INV001</TableCell>
//           <TableCell>Paid</TableCell>
//           <TableCell>Credit Card</TableCell>
//           <TableCell className="text-right">$250.00</TableCell>
//         </TableRow>
//       </TableBody>
//     </Table>
//   );
// }
