import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { type PriceTier } from '~/app/_domain/price-tiers';
import { getPriceTierChangeScenario, getValidPaidPriceTier } from '~/app/_utils/price-tier-utils';
import { getExceededFeatures } from '~/app/_utils/price-tier-utils.server-only';
import { obj2str } from '~/app/_utils/string-utils';
import { changePlanUpgradeCreateCheckoutSession } from '~/app/_utils/stripe-utils';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';
import { getCustomerByOrgId } from '~/server/queries';
import ProcessingPlanChange from '../_components/ProcessingPlanChange';
import { UpgradeStripeCheckoutForm } from '../_components/UpgradeStripeCheckoutForm';

type SearchParams = Promise<Record<'toTierId', string | undefined>>;

export default async function UpgradePage(props: { searchParams: SearchParams }) {
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

    // Expecting a valid paid From tier:
    const parsedPaidFromTier = getValidPaidPriceTier(sessionClaims?.metadata?.tier);
    if (!parsedPaidFromTier) {
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

    // Expecting an upgrade:
    const changePlanScenario = getPriceTierChangeScenario(parsedPaidFromTier.id, parsedPaidToTier.id);
    if (changePlanScenario !== 'paid-to-paid-upgrade') {
        throw new AppError({
            internalMessage: `Expected 'paid-to-paid-upgrade', got ${changePlanScenario} for ${obj2str(parsedPaidToTier)} to ${obj2str(parsedPaidFromTier)}.`,
        });
    }

    // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
    const exceededFeatures = await getExceededFeatures(parsedPaidFromTier.id, parsedPaidToTier.id);
    if (exceededFeatures?.length > 0) {
        return redirect(ROUTES.changePlan);
    }

    return (
        <Suspense fallback={<ProcessingPlanChange progress={55} />}>
            <Step2StripeProcessing fromTier={parsedPaidFromTier} toTier={parsedPaidToTier} orgId={orgId} />
        </Suspense>
    );
}

async function Step2StripeProcessing(props: { fromTier: PriceTier; toTier: PriceTier; orgId: string }) {
    if (!props.toTier.stripePriceId) {
        throw new AppError({
            internalMessage: `Expected a non-empty Stripe price for ${obj2str(props.toTier)}.`,
        });
    }
    const stripeCustomerId = (await getCustomerByOrgId(props.orgId)).stripeCustomerId;
    if (!stripeCustomerId) {
        throw new AppError({
            internalMessage: `Expected a stripeCustomerId in our db for ${props.orgId}, got null instead.`,
        });
    }

    const clientSecret = await changePlanUpgradeCreateCheckoutSession({
        fromTierId: props.fromTier.id,
        toTierId: props.toTier.id,
    });

    if (!clientSecret) {
        throw new AppError({
            internalMessage: `Could not initialize Stripe checkout session.`,
        });
    }

    return (
        <Suspense fallback={<ProcessingPlanChange progress={100} />}>
            <FinalStepShowStripeCheckoutForm stripeClientSecret={clientSecret} />
        </Suspense>
    );
}

async function FinalStepShowStripeCheckoutForm(props: { stripeClientSecret: string }) {
    const { userId } = await auth();
    if (!userId) {
        throw new AppError({ internalMessage: `No Clerk user id found` });
    }

    return (
        <SplitScreenContainer
            title="Change plan"
            subtitle="Please enter your payment details below."
            mainComponent={<UpgradeStripeCheckoutForm stripeClientSecret={props.stripeClientSecret} />}
        />
    );
}
