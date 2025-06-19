import { auth } from '@clerk/nextjs/server';
import { api } from '../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { Labeled } from '~/components/Labeled';
import { OverviewCard } from '~/components/OverviewCard';
import { type StripeCustomerId } from '~/domain/stripe';
import { AppError } from '~/lib/error-utils.server';
import { getValidPriceTier, isFreePriceTier, isPaidPriceTier } from '~/lib/price-tier-utils';
import { getActiveStripeSubscriptionItem } from '~/lib/stripe-utils';

export async function SubscriptionDetails() {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No userid or orgId found in auth.`,
        });
    }

    const tierId = sessionClaims?.metadata.tier;
    const parsedTier = getValidPriceTier(tierId);

    //TODO
    /**
     *    PLAN
     *
     * Name \: premuim
     * Price
     * Next billing period/ if paid
     * Organization
     *
     */

    if (parsedTier && isPaidPriceTier(parsedTier.id)) {
        const organization = await fetchQuery(api.organizations.getOrganization, { clerkOrgId: orgId });
        if (!organization?.stripeCustomerId) {
            throw new Error(`Missing Stripe customer Id.`)
        }
        const stripeSub = await getActiveStripeSubscriptionItem(organization.stripeCustomerId as StripeCustomerId);
        const subPrice = `USD ${parsedTier.monthlyUsdPrice.toFixed(2)}/month`;
        const currentPeriodEnd = stripeSub?.current_period_end
            ? new Date(stripeSub?.current_period_end * 1000).toLocaleDateString()
            : '--';

        //TODO More stripe info - invoices, email ?

        return (
            <OverviewCard
                title={'Subscription'}
                sections={[
                    {
                        title: '',
                        content: (
                            <div className="mt-2 flex flex-col flex-nowrap gap-2">
                                <Labeled label={'Price'} text={subPrice} />
                                <Labeled label={'NEXT BILLING PERIOD START'} text={currentPeriodEnd} />
                            </div>
                        ),
                    },
                ]}
                variant="neutral"
            />
        );
    }

    if (parsedTier && isFreePriceTier(parsedTier.id)) {
        return (
            <OverviewCard
                title={'Subscription'}
                sections={[
                    {
                        title: '',
                        content: (
                            <div className="mt-2 flex flex-col flex-nowrap gap-2">
                                <Labeled label={'Price'} text="FREE" />
                            </div>
                        ),
                    },
                ]}
                variant="neutral"
            />
        );
    }

    return null;
}
