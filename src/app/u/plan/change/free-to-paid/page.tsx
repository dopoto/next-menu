import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Stripe } from 'stripe';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { type PriceTier, type PriceTierId } from '~/app/_domain/price-tiers';
import { getValidFreePriceTier, getValidPaidPriceTier } from '~/app/_utils/price-tier-utils';
import { getExceededFeatures } from '~/app/_utils/price-tier-utils.server-only';
import { obj2str } from '~/app/_utils/string-utils';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';
import { getCustomerByOrgId } from '~/server/queries';
import { FreeToPaidStripeCheckoutForm } from '../_components/FreeToPaidStripeCheckoutForm';
import ProcessingPlanChange from '../_components/ProcessingPlanChange';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<Record<'toTierId', string | undefined>>;

export default async function FreeToPaidPage(props: { searchParams: SearchParams }) {
    const { toTierId } = await props.searchParams;

    return (
        <Suspense fallback={<ProcessingPlanChange progress={14} />}>
            <Step1PreChangeValidations toTierId={toTierId} />
        </Suspense>
    );
}

async function Step1PreChangeValidations(props: { toTierId?: string }) {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
        redirect(ROUTES.signIn);
    }

    // Expecting a valid free From tier:
    const parsedFreeFromTier = getValidFreePriceTier(sessionClaims?.metadata?.tier);
    if (!parsedFreeFromTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
        });
    }

    // Expecting a valid paid To tier:
    const parsedPaidToTier = getValidPaidPriceTier(props.toTierId);
    if (!parsedPaidToTier) {
        throw new AppError({
            internalMessage: `Missing or invalid To tier in props.toTierId. got: ${props.toTierId}`,
        });
    }

    // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
    const exceededFeatures = await getExceededFeatures(parsedFreeFromTier.id, parsedPaidToTier.id);
    if (exceededFeatures?.length > 0) {
        return redirect(ROUTES.changePlan);
    }

    return (
        <Suspense fallback={<ProcessingPlanChange progress={55} />}>
            <Step2CreateStripeCustomerAndSubscription
                fromTier={parsedFreeFromTier}
                toTier={parsedPaidToTier}
                orgId={orgId}
            />
        </Suspense>
    );
}

async function Step2CreateStripeCustomerAndSubscription(props: {
    fromTier: PriceTier;
    toTier: PriceTier;
    orgId: string;
}) {
    if (!props.toTier.stripePriceId) {
        throw new AppError({
            internalMessage: `Expected a non-empty Stripe price for ${obj2str(props.toTier)}.`,
        });
    }
    const stripeCustomerId = (await getCustomerByOrgId(props.orgId)).stripeCustomerId;
    if (stripeCustomerId) {
        throw new AppError({
            internalMessage: `Expected a null stripeCustomerId in our db for ${props.orgId}, got ${stripeCustomerId} instead.`,
        });
    }

    const newStripeCustomer = await stripe.customers.create({
        description: 'Created from /plan/change/free-to-paid.',
        metadata: {
            orgId: props.orgId,
        },
    });

    return (
        <Suspense fallback={<ProcessingPlanChange progress={100} />}>
            <FinalStepShowStripeCheckoutForm
                newStripeCustomerId={newStripeCustomer.id}
                fromTierId={props.fromTier.id}
                toTierId={props.toTier.id}
            />
        </Suspense>
    );
}

async function FinalStepShowStripeCheckoutForm(props: {
    newStripeCustomerId: string;
    fromTierId: PriceTierId;
    toTierId: PriceTierId;
}) {
    const { userId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: `No Clerk user id found` });
    }

    return (
        <SplitScreenContainer
            title={`Change plan`}
            subtitle="Please enter your payment details below."
            mainComponent={
                <FreeToPaidStripeCheckoutForm
                    newStripeCustomerId={props.newStripeCustomerId}
                    fromTierId={props.fromTierId}
                    toTierId={props.toTierId}
                />
            }
        />
    );
}
