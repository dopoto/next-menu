import { auth, clerkClient } from '@clerk/nextjs/server';
import { api } from '../../../convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Stripe } from 'stripe';
import { PlanChanged } from '~/app/u/plan/change/_components/PlanChanged';
import ProcessingPlanChange from '~/app/u/plan/change/_components/ProcessingPlanChange';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { type PriceTier } from '~/domain/price-tiers';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { getValidFreePriceTier, getValidPaidPriceTier } from '~/lib/price-tier-utils';
import { getExceededFeatures } from '~/lib/price-tier-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { obj2str } from '~/lib/string-utils';
//import { updateOrganizationStripeCustomerId } from '~/server/queries/organizations';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<'toTierId', string | undefined>>;

export default async function PaidToFreePage(props: { searchParams: SearchParams }) {
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
        redirect(ROUTES.signIn);
    }

    // Expecting a valid paid From tier:
    const parsedPaidFromTier = getValidPaidPriceTier(sessionClaims?.metadata?.tier);
    if (!parsedPaidFromTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
        });
    }

    // Expecting a valid free To tier:
    const parsedFreeToTier = getValidFreePriceTier(props.toTierId);
    if (!parsedFreeToTier) {
        throw new AppError({
            internalMessage: `Missing or invalid To tier in props.toTierId. got: ${props.toTierId}`,
        });
    }

    // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
    const exceededFeatures = await getExceededFeatures(parsedPaidFromTier.id, parsedFreeToTier.id);
    if (exceededFeatures?.length > 0) {
        return redirect(ROUTES.changePlan);
    }

    return (
        <Suspense fallback={<ProcessingPlanChange progress={40} />}>
            <Step2 fromTier={parsedPaidFromTier} toTier={parsedFreeToTier} orgId={orgId} />
        </Suspense>
    );
}

async function Step2(props: { fromTier: PriceTier; toTier: PriceTier; orgId: string }) {
    const stripeCustomerId = (await fetchQuery(api.organizations.getOrganization, { clerkOrgId: props.orgId }))?.stripeCustomerId;
    if (!stripeCustomerId) {
        throw new AppError({
            internalMessage: `Cannot find Stripe customer for organization ${props.orgId}`,
        });
    }

    // TODO refactor - extract to util fn:

    const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
    });

    if (!subscriptions || subscriptions.data.length === 0) {
        throw new AppError({
            internalMessage: `No active subscription found for customer ${stripeCustomerId}`,
        });
    }

    if (subscriptions.data.length > 1) {
        throw new AppError({
            internalMessage: `More than 1 subscription found for customer ${stripeCustomerId}`,
        });
    }

    const currentSubscription = subscriptions.data[0];

    if (!currentSubscription?.items?.data?.[0]?.id) {
        throw new AppError({
            internalMessage: `An id was not found in currentSubscription?.items?.data?.[0] for subscription ${obj2str(currentSubscription)}`,
        });
    }

    return (
        <Suspense fallback={<ProcessingPlanChange progress={60} />}>
            <FinalStep stripeSubscription={currentSubscription} fromTier={props.fromTier} toTier={props.toTier} />
        </Suspense>
    );
}

async function FinalStep(props: { stripeSubscription: Stripe.Subscription; fromTier: PriceTier; toTier: PriceTier }) {
    const { userId, orgId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: `No Clerk user id found` });
    }
    if (!orgId) {
        throw new AppError({ internalMessage: `No Clerk orgId found` });
    }

    // Cancel their Stripe subscription
    await stripe.subscriptions.cancel(props.stripeSubscription.id, {
        cancellation_details: {
            comment: 'User moved to free tier using /plan/change/paid-to-free.',
        },
        prorate: true,
    });

    // Delete their Stripe customer id from our records.
    // TODO
    // await updateOrganizationStripeCustomerId({
    //     clerkOrgId: orgId,
    //     stripeCustomerId: null,
    // });

    // Update Clerk with new tier
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { tier: props.toTier.id },
    });

    return (
        <SplitScreenContainer
            title={`Thank you!`}
            subtitle="Your subscription has been updated."
            mainComponent={<PlanChanged fromTier={props.fromTier} toTier={props.toTier} />}
        />
    );
}
