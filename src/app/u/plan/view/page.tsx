import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Suspense } from 'react';
import { Labeled } from '~/app/_components/Labeled';
import { OverviewCard } from '~/app/_components/OverviewCard';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { SubscriptionDetails } from '~/app/_components/SubscriptionDetails';
import { priceTierFeatures } from '~/app/_domain/price-tier-features';
import { type PriceTierFeatureUsage } from '~/app/_domain/price-tier-usage';
import { type PriceTier } from '~/app/_domain/price-tiers';
import { getValidPriceTier } from '~/app/_utils/price-tier-utils';
import { getAvailableFeatureQuota } from '~/app/_utils/quota-utils.server-only';
import { obj2str } from '~/app/_utils/string-utils';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';

export default async function ViewPlanPage() {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        throw new AppError({
            internalMessage: 'Unauthorized',
            publicMessage: 'Unauthorized',
        });
    }

    const tierId = sessionClaims?.metadata.tier;
    const parsedTier = getValidPriceTier(tierId);
    if (!parsedTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
        });
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
                                title={'Plan usage'}
                                subtitle={'The resources currently used by your organization'}
                                sections={[
                                    {
                                        title: '',
                                        content: (
                                            <div className="pt-8">
                                                <PlanUsageSkeleton rows={parsedTier.features.length} />
                                            </div>
                                        ),
                                    },
                                ]}
                                variant="neutral"
                            />
                        }
                    >
                        <OverviewCard
                            title={'Plan usage'}
                            subtitle={'The resources currently used by your organization'}
                            sections={[
                                {
                                    title: '',
                                    content: (
                                        <div className="pt-8">
                                            <PlanUsage tier={parsedTier} />
                                        </div>
                                    ),
                                },
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
            title={'Your plan'}
            subtitle={`You are currently on the ${parsedTier.name} plan.`}
        ></SplitScreenContainer>
    );
}

async function PlanUsage(props: { tier: PriceTier }) {
    const featuresInCurrentTier = props.tier.features;
    const featuresInCurrentTierWithUsage: PriceTierFeatureUsage[] = await Promise.all(
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
        <>
            {featuresInCurrentTierWithUsage.map((featureUsage) => {
                const { id, planQuota, used } = featureUsage;
                const feature = priceTierFeatures[id];

                const percentageUsed = (used / planQuota) * 100;
                const label = feature.resourcePluralName;
                const text = `You are using ${used.toLocaleString()} out of your total ${planQuota.toLocaleString()} quota.`;

                return (
                    <div className="flex w-full flex-col gap-2 pb-6" key={id}>
                        <Labeled label={label} text={text} />
                        <Progress value={percentageUsed} className="w-full  " />
                    </div>
                );
            })}
        </>
    );
}

function PlanUsageSkeleton(props: { rows: number }) {
    return (
        <>
            {Object.keys(priceTierFeatures).map((key) => {
                const feature = priceTierFeatures[key as keyof typeof priceTierFeatures];
                return (
                    <div className="flex w-full flex-col gap-2 pb-6" key={key}>
                        <Labeled
                            label={feature.resourcePluralName}
                            text={<Skeleton className="h-[20px] w-[250px]" />}
                        />
                        <Progress value={0} className="w-full " />
                    </div>
                );
            })}
        </>
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
