import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { OverviewCard } from "../_components/OverviewCard";
import { SplitScreenContainer } from "../_components/SplitScreenContainer";
import { auth } from "@clerk/nextjs/server";
import { getValidPriceTier } from "../_utils/price-tier-utils";
import { obj2str } from "../_utils/string-utils";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { type PriceTier } from "../_domain/price-tiers";
import { type PriceTierFeatureUsage } from "../_domain/price-tier-features";
import { getAvailableQuota } from "../_utils/quota-utils";

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
          {/* <Suspense fallback="Loading...">
            <OverviewCard
              title={"Plan billing"}
              sections={[{ title: "", content: <PlanBilling /> }]}
              variant="neutral"
            />
          </Suspense> */}
          <div className="flex w-full flex-col gap-2">
            <Link href="/my" className="w-full">
              <Button variant="outline" className="w-full">
                Go back to my account
              </Button>
            </Link>
            <Link href="/change-plan" className="w-full">
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
        const available = await getAvailableQuota(feature.id);
        return { id: feature.id, planQuota: feature.quota, available, used: feature.quota - available };
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

function PlanBilling() {
  return (
    <Table className="mt-2">
      <TableCaption>A list of your billing!!</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
