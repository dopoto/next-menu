import { auth, clerkClient } from '@clerk/nextjs/server';
import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Stripe from 'stripe';
import { PlanChanged } from '~/app/u/plan/change/_components/PlanChanged';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { stripeCustomerIdSchema, type StripeCustomerId, type StripeSubscriptionId, type UpgradeTiersStripeMetadata } from '~/domain/stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { getPriceTierChangeScenario, getValidPaidPriceTier } from '~/lib/price-tier-utils';
import { obj2str } from '~/lib/string-utils';
import { getActiveStripeSubscriptionItem } from '~/lib/stripe-utils';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<'session_id', string | undefined>>;

/**
 * Users are redirected here after choosing to upgrade between paid price tiers and
 * after paying the more expensive tiers for the rest of the current month.
 * This page will validate the payment and will process moving the org to the new tier.
 */
export default async function UpgradePostPaymentPage(props: { searchParams: SearchParams }) {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: `No auth userId found.` });
    }

    const { session_id: sessionId } = await props.searchParams;
    if (!sessionId) {
        throw new AppError({ internalMessage: `No session_id param` });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
        throw new AppError({
            internalMessage: `No Stripe session found for session_id param "${sessionId}"`,
        });
    }

    // Expecting a complete payment
    if (session.status !== 'complete') {
        throw new AppError({
            internalMessage: `Expected a session with status=complete, got ${session.status}.`,
        });
    }

    const metadata: UpgradeTiersStripeMetadata | null = session.metadata as UpgradeTiersStripeMetadata;

    //Expecting a valid paid From tier:
    const parsedPaidFromTier = getValidPaidPriceTier(metadata?.fromTierId);
    if (!parsedPaidFromTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier metadata: ${obj2str(metadata ?? {})}`,
        });
    }

    // Expecting a valid paid To tier:
    const parsedPaidToTier = getValidPaidPriceTier(metadata?.toTierId);
    if (!parsedPaidToTier) {
        throw new AppError({
            internalMessage: `Missing or invalid To tier metadata: ${obj2str(metadata ?? {})}`,
        });
    }

    // Expecting an upgrade scenario
    const changePlanScenario = getPriceTierChangeScenario(parsedPaidFromTier.id, parsedPaidToTier.id);
    if (changePlanScenario !== 'paid-to-paid-upgrade') {
        throw new AppError({
            internalMessage: `Expected 'paid-to-paid-upgrade', got ${changePlanScenario} for ${obj2str(parsedPaidToTier)} to ${obj2str(parsedPaidFromTier)}.`,
        });
    }

    const subscriptionId: StripeSubscriptionId | null = metadata.stripeSubscriptionId;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Validate Stripe customer Id
    const tmpStripeCustomerId = subscription.customer;
    if (!tmpStripeCustomerId) {
        throw new AppError({
            internalMessage: `No stripeCustomerId found in subscription ${obj2str(subscription)}`,
        });
    }
    const stripeCustomerIdValidationResult = stripeCustomerIdSchema.safeParse(tmpStripeCustomerId);
    if (!stripeCustomerIdValidationResult.success) {
        throw new AppError({
            internalMessage: `Unexpected value received for Stripe customer id: ${JSON.stringify(tmpStripeCustomerId)}`,
        });
    }
    const parsedStripeCustomerId = stripeCustomerIdValidationResult.data;

    // Expecting the customer Id returned by Stripe for this sub to match our records
    const dbCustomer = await fetchQuery(api.organizations.getOrganization, { clerkOrgId: orgId ?? '' });

    if (parsedStripeCustomerId.toString() !== dbCustomer?.stripeCustomerId) {
        throw new AppError({
            internalMessage: `Expected db match for Stripe customer id ${parsedStripeCustomerId}, got ${dbCustomer?.stripeCustomerId}.`,
        });
    }

    const activeStripeSubItem = await getActiveStripeSubscriptionItem(parsedStripeCustomerId);

    if (!activeStripeSubItem?.id) {
        throw new AppError({
            internalMessage: `Stripe sub item not found for Stripe customer id: ${parsedStripeCustomerId}.`,
        });
    }

    // Move the customer to the upgraded tier in Stripe
    await stripe.subscriptions.update(subscriptionId, {
        items: [
            {
                id: activeStripeSubItem.id,
                price: parsedPaidToTier.stripePriceId,
            },
        ],
    });

    await stripe.subscriptions.update(subscriptionId, {
        items: [
            {
                id: activeStripeSubItem.id,
                price: parsedPaidToTier.stripePriceId,
            },
        ],
    });

    // Update Clerk with new tier
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { tier: parsedPaidToTier.id },
    });

    return (
        <SplitScreenContainer
            title={`Thank you!`}
            subtitle="Your price plan has been updated."
            mainComponent={<PlanChanged fromTier={parsedPaidFromTier} toTier={parsedPaidToTier} />}
        />
    );
}
