import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Stripe from 'stripe';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { PlanChanged } from '~/app/u/plan/change/_components/PlanChanged';
import ProcessingPlanChange from '~/app/u/plan/change/_components/ProcessingPlanChange';
import { type PriceTier } from '~/domain/price-tiers';
import { type StripeCustomerId, type StripeRefundId, type StripeSubscriptionId } from '~/domain/stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { getPriceTierChangeScenario, getValidPaidPriceTier } from '~/lib/price-tier-utils';
import { getExceededFeatures } from '~/lib/price-tier-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { obj2str } from '~/lib/string-utils';
import { getActiveStripeSubscriptionItem, getActiveSubscriptionItemId } from '~/lib/stripe-utils';
import { getOrganizationByClerkOrgId } from '~/server/queries/organization';

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

type SearchParams = Promise<Record<'toTierId', string | undefined>>;

export default async function DowngradePage(props: { searchParams: SearchParams }) {
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

    // Expecting a downgrade:
    const changePlanScenario = getPriceTierChangeScenario(parsedPaidFromTier.id, parsedPaidToTier.id);
    if (changePlanScenario !== 'paid-to-paid-downgrade') {
        throw new AppError({
            internalMessage: `Expected 'paid-to-paid-downgrade', got ${changePlanScenario} for ${obj2str(parsedPaidToTier)} to ${obj2str(parsedPaidFromTier)}.`,
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
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        throw new AppError({
            internalMessage: `No userId or orgId found in auth.`,
        });
    }

    const stripeCustomerId = (await getOrganizationByClerkOrgId(orgId)).stripeCustomerId as StripeCustomerId;
    if (!stripeCustomerId) {
        throw new AppError({
            internalMessage: `Expected a stripeCustomerId in our db for ${orgId}, got null instead.`,
        });
    }

    const activeStripeSubItem = await getActiveStripeSubscriptionItem(stripeCustomerId);

    if (!activeStripeSubItem) {
        throw new AppError({ internalMessage: `Active sub item missing.` });
    }

    const currentPriceId = activeStripeSubItem?.price.id;
    if (!currentPriceId) {
        throw new AppError({ internalMessage: `Missing price id` });
    }
    if (currentPriceId !== props.fromTier.stripePriceId) {
        throw new AppError({
            internalMessage: `From tier mismatch. Expected: ${props.fromTier.stripePriceId}. Got: ${currentPriceId}.`,
        });
    }

    const activeStripeSubItemId = await getActiveSubscriptionItemId(activeStripeSubItem);

    // Update the Stripe subscription to the downgraded tier
    const updatedSubscription = await stripe.subscriptions.update(activeStripeSubItem.id, {
        items: [
            {
                id: activeStripeSubItemId,
                price: props.toTier.stripePriceId,
            },
        ],
        // Create an invoice immediately with the proration
        proration_behavior: 'always_invoice',
        // Keep the same billing cycle date
        billing_cycle_anchor: 'unchanged',
    });

    // Find the proration invoice that was just created
    const invoices = await stripe.invoices.list({
        subscription: activeStripeSubItem.id,
        limit: 1,
        created: {
            // Look for invoices created in the last minute
            gte: Math.floor(Date.now() / 1000) - 60,
        },
    });

    const prorationInvoice = invoices.data[0];

    if (!prorationInvoice) {
        throw new AppError({ internalMessage: `ProrationInvoice missing` });
    }

    let refundDetails: StripeDowngradeRefund | null = null;

    // If the invoice represents a credit, process a refund
    if (prorationInvoice && prorationInvoice.total < 0) {
        // Find a charge to refund against
        const charges = await stripe.charges.list({
            customer: stripeCustomerId,
            limit: 5,
        });

        const eligibleCharge = charges.data.find(
            (charge) =>
                !charge.refunded && charge.status === 'succeeded' && charge.amount >= Math.abs(prorationInvoice.total),
        );

        if (typeof eligibleCharge?.payment_intent !== 'string') {
            const intMsg = `Unexpected payment_intent: ${JSON.stringify(eligibleCharge?.payment_intent)}.`;
            throw new AppError({ internalMessage: intMsg });
        }

        if (eligibleCharge) {
            // Process a refund for the credit amount
            const refund = await stripe.refunds.create({
                payment_intent: eligibleCharge.payment_intent?.toString(), //TODO validate 1st
                amount: Math.abs(prorationInvoice.total),
                reason: 'requested_by_customer',
                metadata: {
                    subscription_id: activeStripeSubItem.id,
                    invoice_id: prorationInvoice.id ?? '',
                    downgrade_from: props.fromTier.id,
                    downgrade_to: props.toTier.id,
                },
            });

            refundDetails = {
                id: refund.id as StripeRefundId,
                amount: refund.amount,
                status: refund.status,
            };
        }
    }

    const details: StripeDowngradeTxDetails = {
        subscription: {
            id: updatedSubscription.id as StripeSubscriptionId,
            status: updatedSubscription.status,
            currentPeriodEnd: new Date(activeStripeSubItem.current_period_end * 1000).toISOString(),
        },
        invoice: {
            id: prorationInvoice.id ?? '',
            amount: prorationInvoice.total / 100, // Convert from cents
            currency: prorationInvoice.currency,
            status: prorationInvoice.status,
        },
        refund: refundDetails,
    };

    // Move user to new tier
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { tier: props.toTier.id },
    });

    return (
        <Suspense fallback={<ProcessingPlanChange progress={100} />}>
            <FinalStepShowConfirmation fromTier={props.fromTier} toTier={props.toTier} txDetails={details} />
        </Suspense>
    );
}

async function FinalStepShowConfirmation(props: {
    fromTier: PriceTier;
    toTier: PriceTier;
    txDetails: StripeDowngradeTxDetails;
}) {
    return (
        <SplitScreenContainer
            title="Change plan"
            subtitle="Please enter your payment details below."
            mainComponent={
                <>
                    {/* TODO overview */}
                    {/* {obj2str(props.txDetails)} */}
                    <PlanChanged fromTier={props.fromTier} toTier={props.toTier} />
                </>
            }
        />
    );
}

type StripeDowngradeTxDetails = {
    subscription: {
        id: StripeSubscriptionId;
        status: Stripe.Subscription.Status;
        currentPeriodEnd: string;
    };
    invoice?: StripeDowngradeProrationInvoice;
    refund: StripeDowngradeRefund | null;
};

type StripeDowngradeProrationInvoice = {
    id: string;
    amount: number;
    currency: string;
    status?: Stripe.Invoice.Status | null;
};

type StripeDowngradeRefund = {
    id: StripeRefundId;
    /**
     * Amount in cents.
     */
    amount: number;
    /**
     * pending, requires_action, succeeded, failed, or canceled
     */
    status: string | null;
};
