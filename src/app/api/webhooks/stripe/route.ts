'use server';

import { headers } from 'next/headers';
import Stripe from 'stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { processFailedPayment, processSuccessfulPayment } from '~/lib/payment-utils';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = 'TODO'; //env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        console.error('Missing stripe-signature header');
        return new Response('Missing stripe-signature', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return new Response(
            `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            {
                status: 400,
            },
        );
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await handleChargeRefunded(event.data.object);
                break;
            case 'payment_intent.requires_action':
                await handlePaymentIntentRequiresAction(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        return new Response('Webhook processed successfully', { status: 200 });
    } catch (err) {
        console.error('Error processing webhook:', err);
        return new Response(`Webhook processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`, {
            status: 400,
        });
    }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
        const customer = paymentIntent.customer as string | null;

        const subscription = await findSubscriptionByPaymentIntent(paymentIntent.id);
        if (subscription) {
            // For subscription payments
            if (!customer) {
                throw new AppError({
                    internalMessage: `No customer found for subscription payment intent ${paymentIntent.id}`,
                });
            }
            await handleSubscriptionPayment(customer, subscription);
        } else {
            // For one-time payments (like menu items), process merchant transfer
            await processSuccessfulPayment(paymentIntent);

            // If this is a menu item payment, handle specific logic
            if (paymentIntent.metadata?.menuItemId) {
                // Add your menu item purchase handling logic here
                // For example: update order status, send confirmation, etc.
                console.log(`Menu item ${paymentIntent.metadata.menuItemId} purchased successfully`);
            }
        }
    } catch (err) {
        console.error('Error handling successful payment:', err);
        throw err;
    }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
        await processFailedPayment(paymentIntent);

        if (paymentIntent.metadata?.menuItemId) {
            console.log(`Menu item payment failed: ${paymentIntent.metadata.menuItemId}`);
            // Add your failed menu item purchase handling logic here
            // For example: notify merchant, update order status, etc.
        }
    } catch (err) {
        console.error('Error handling failed payment:', err);
        throw err;
    }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
    try {
        // Get the original payment intent if it exists
        const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;

        if (paymentIntentId) {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            // If this was a menu item payment, handle it specially
            if (paymentIntent.metadata?.menuItemId) {
                console.log(`Menu item ${paymentIntent.metadata.menuItemId} refunded`);
                // Add your menu item refund handling logic here
                // For example: update order status, notify merchant, etc.
            }
        }

        console.log(`Refund processed for charge ${charge.id}`);
    } catch (err) {
        console.error('Error handling refund:', err);
        throw err;
    }
}

async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
    try {
        if (paymentIntent.metadata?.menuItemId) {
            console.log(`Menu item ${paymentIntent.metadata.menuItemId} requires additional authentication`);
            // Handle any special logic needed for 3D Secure, etc.
        }
    } catch (err) {
        console.error('Error handling payment requires action:', err);
        throw err;
    }
}

async function handleSubscriptionPayment(stripeCustomerId: string, subscription: Stripe.Subscription) {
    // Update subscription status in database
    console.log(`Subscription payment successful for customer ${stripeCustomerId}`);

    // You could add additional subscription-specific logic here
    // For example:
    // - Update subscription status in your database
    // - Send confirmation emails
    // - Update user's subscription tier
    // - Track subscription metrics
}

async function findSubscriptionByPaymentIntent(paymentIntentId: string): Promise<Stripe.Subscription | null> {
    try {
        // First try to find the payment intent to get the customer
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const customerId = paymentIntent.customer as string | null;

        if (!customerId) {
            return null;
        }

        // Then look for an active subscription for this customer
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        });

        return subscriptions.data[0] || null;
    } catch (err) {
        console.error('Error finding subscription:', err);
        return null;
    }
}
