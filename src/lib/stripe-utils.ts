import { auth } from '@clerk/nextjs/server';
import 'server-only';
import Stripe from 'stripe';
import { type PriceTierId } from '~/domain/price-tiers';
import {
    type StripeCustomerId,
    type StripeSubscriptionId,
    type StripeSubscriptionItemId,
    type UpgradeTiersStripeMetadata,
} from '~/domain/stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { getValidPaidPriceTier } from '~/lib/price-tier-utils';
import { obj2str } from '~/lib/string-utils';
import { getOrganizationByClerkOrgId } from '~/server/queries/organization';

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

export async function getActiveStripeSubscriptionItem(
    stripeCustomerId?: StripeCustomerId,
): Promise<Stripe.SubscriptionItem | undefined> {
    let customerId;
    let orgId;

    if (stripeCustomerId) {
        customerId = stripeCustomerId;
    } else {
        orgId = (await auth()).orgId;
        if (!orgId) {
            throw new AppError({ internalMessage: `No orgId found in auth.` });
        }
        customerId = (await getOrganizationByClerkOrgId(orgId)).stripeCustomerId;
    }

    if (!customerId) {
        throw new AppError({
            internalMessage: `No stripeCustomerId. orgId: ${orgId}. Was passed stripeCustomerId: ${stripeCustomerId}.`,
        });
    }

    // Retrieve user's active subscription
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
    });

    if (subscriptions.data.length === 0) {
        throw new AppError({
            internalMessage: `No active subscriptions found for stripeCustomerId ${customerId}.`,
        });
    }

    return subscriptions.data[0]?.items.data[0];
}

export async function getActiveSubscriptionItemId(
    subItem?: Stripe.SubscriptionItem,
): Promise<StripeSubscriptionItemId> {
    if (!subItem) {
        throw new AppError({ internalMessage: `No subscription item.` });
    }
    const subscriptionItem = subItem ?? (await getActiveStripeSubscriptionItem());

    if (subscriptionItem?.plan.active !== true) {
        throw new AppError({
            internalMessage: `Subscription item not active for sub ${subscriptionItem.id}`,
        });
    }

    if (!subscriptionItem.id) {
        throw new AppError({
            internalMessage: `Subscription item not found for sub ${subscriptionItem.id}`,
        });
    }

    return subscriptionItem.id as StripeSubscriptionItemId;
}

export const changePlanUpgradeCreateCheckoutSession = async (props: {
    fromTierId: PriceTierId;
    toTierId: PriceTierId;
}) => {
    // TODO validate priceId, newStripeCustomerId, userauth(?)

    // Expecting a valid paid From tier:
    const parsedPaidFromTier = getValidPaidPriceTier(props.fromTierId);
    if (!parsedPaidFromTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in props.fromTierId: ${props.fromTierId}`,
        });
    }

    // Expecting a valid paid To tier:
    const parsedPaidToTier = getValidPaidPriceTier(props.toTierId);
    if (!parsedPaidToTier) {
        throw new AppError({
            internalMessage: `Missing or invalid To tier in props.toTierId: ${props.toTierId}`,
        });
    }

    const { orgId } = await auth();

    if (!orgId) {
        throw new AppError({ internalMessage: `No orgId found in auth.` });
    }

    const stripeCustomerId = (await getOrganizationByClerkOrgId(orgId)).stripeCustomerId;
    if (!stripeCustomerId) {
        throw new AppError({
            internalMessage: `Expected a stripeCustomerId in our db for ${orgId}, got null instead.`,
        });
    }

    // Retrieve user's active subscription
    const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1,
    });

    if (subscriptions.data.length === 0) {
        throw new AppError({
            internalMessage: `No active subscriptions found for stripeCustomerId ${stripeCustomerId}.`,
        });
    }

    if (subscriptions.data.length > 1) {
        throw new AppError({
            internalMessage: `Several active subscriptions found for stripeCustomerId ${stripeCustomerId}.`,
        });
    }

    const subscription = subscriptions.data[0];

    const subscriptionId = subscription?.id as StripeSubscriptionId;

    if (!subscriptionId) {
        throw new AppError({
            internalMessage: `Cannot find subscriptionId for stripeCustomerId ${stripeCustomerId}.`,
        });
    }

    const currentSubscription = subscriptions.data[0];

    if (!currentSubscription?.items?.data?.[0]?.id) {
        throw new AppError({
            internalMessage: `An id was not found in currentSubscription?.items?.data?.[0] for subscription ${obj2str(currentSubscription)}`,
        });
    }
    const subscriptionItemId = currentSubscription.items.data[0].id; //'si_RvhYtqKirxQTR2'

    // Calculate the prorated amount by previewing an invoice
    const invoicePreview = await stripe.invoices.createPreview({
        customer: stripeCustomerId,
        subscription: subscriptionId,
        subscription_details: {
            items: [
                {
                    id: subscriptionItemId,
                    price: parsedPaidToTier.stripePriceId,
                },
            ],
            proration_behavior: 'always_invoice',
        },
    });

    // TODO ensure payment is made before redirecting to success
    // Create a checkout session for the prorated amount

    const metadata: UpgradeTiersStripeMetadata = {
        stripeSubscriptionId: subscriptionId,
        fromTierId: parsedPaidFromTier.id,
        toTierId: parsedPaidToTier.id,
    };
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Subscription Upgrade (Proration)',
                        description: `Upgrade from ${parsedPaidFromTier.name} to ${parsedPaidToTier.name}`,
                    },
                    unit_amount: invoicePreview.amount_due,
                },
                quantity: 1,
            },
        ],
        metadata,
        ui_mode: 'embedded',
        // TODO put in ROUTES:
        return_url: `${env.NEXT_PUBLIC_APP_URL}/plan/change/upgrade/post-payment?session_id={CHECKOUT_SESSION_ID}`,
    });

    return session.client_secret;
};
