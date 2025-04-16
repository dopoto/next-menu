import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Suspense } from 'react';
import { Labeled } from '~/app/_components/Labeled';
import { OverviewCard } from '~/app/_components/OverviewCard';
import { SubscriptionDetails } from '~/app/_components/SubscriptionDetails';
import { getValidPriceTier } from '~/app/_utils/price-tier-utils';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/lib/routes';

// TODO Location in overview?

export const Overview = async (props: { claims: CustomJwtSessionClaims }) => {
    const priceTierId = props.claims?.metadata?.tier;
    const parsedTier = getValidPriceTier(priceTierId);
    const user = await currentUser();
    return (
        <div className="flex w-full flex-col gap-1">
            <OverviewCard
                title={'Account'}
                sections={[
                    {
                        title: '',
                        content: (
                            <div className="mt-2 flex flex-col flex-nowrap gap-2">
                                <Labeled label={'Email'} text={`${user?.emailAddresses[0]?.emailAddress}`} />
                                <Labeled label={'Organization'} text={props.claims?.metadata?.orgName} />
                            </div>
                        ),
                    },
                ]}
                variant="neutral"
            />
            <OverviewCard
                title={'Plan'}
                sections={[
                    {
                        title: '',
                        content: (
                            <div className="mt-2 flex flex-col flex-nowrap gap-2">
                                <Labeled label={'Name'} text={parsedTier?.name} />
                                <Labeled label={'Price'} text={`${parsedTier?.monthlyUsdPrice.toFixed(2)} USD/month`} />
                            </div>
                        ),
                    },
                ]}
                variant="neutral"
            />
            <Suspense>
                <SubscriptionDetails />
            </Suspense>
            <div className="flex flex-col gap-6">
                <Link className="w-full" href={ROUTES.my}>
                    <Button className="w-full">Take me to my dashboard</Button>
                </Link>
            </div>
        </div>
    );
};
