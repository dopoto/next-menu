import Stripe from 'stripe';
import { env } from '~/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// Calculate the amount that goes to the app (0.5%)
export function calculateAppFee(amount: number): number {
    return Math.round(amount * 0.005); // 0.5%
}

// Format price for Stripe (convert to cents)
export function formatStripeAmount(price: number): number {
    return Math.round(price * 100);
}

export async function createPaymentIntent(priceNum: number, merchantStripeAccountId: string) {
    const amountInCents = formatStripeAmount(priceNum);
    const applicationFeeAmount = calculateAppFee(amountInCents);
    return stripe.paymentIntents.create(
        {
            amount: amountInCents,
            currency: 'usd', //TODO
            payment_method_types: ['card'], // Digital wallets will be handled by the Payment Request Button
            application_fee_amount: applicationFeeAmount,
            metadata: {
                // TODO Orderid
                // menuItemId: item.id,
                // menuItemName: item.name,
                // type: item.type,
                merchantId: merchantStripeAccountId,
            },
        },
        {
            stripeAccount: merchantStripeAccountId, // This tells Stripe we're creating the PaymentIntent on behalf of the connected account
        },
    );
}

interface PaymentStatusUpdate {
    paymentIntentId: string;
    status: 'succeeded' | 'failed' | 'requires_payment_method' | 'requires_action';
    lastError?: string;
}

// Validate webhook signature
export async function validateStripeWebhookSignature(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string,
): Promise<Stripe.Event> {
    try {
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
        throw new Error(
            `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        );
    }
}

// Process a successful payment intent
export async function processSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    if (paymentIntent.transfer_data?.destination) {
        // For menu item payments, transfer funds to merchant
        const amountReceived = paymentIntent.amount_received;
        const appFeeAmount = calculateAppFee(amountReceived);

        await stripe.transfers.create({
            amount: amountReceived - appFeeAmount,
            currency: paymentIntent.currency,
            destination: paymentIntent.transfer_data.destination.toString(),
            transfer_group: paymentIntent.id,
            description: `Transfer for payment ${paymentIntent.id}`,
            metadata: {
                paymentIntentId: paymentIntent.id,
                ...paymentIntent.metadata,
            },
        });
    }

    // You can add more logic here, such as:
    // - Updating order status in database
    // - Sending confirmation emails
    // - Triggering other business logic
}

// Process a failed payment intent
export async function processFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    // Handle failed payment logic, such as:
    // - Marking order as failed in database
    // - Sending failure notification
    // - Logging for analytics
    console.log(`Payment failed for payment intent ${paymentIntent.id}:`, paymentIntent.last_payment_error?.message);
}

// Get payment status details
export async function getPaymentDetails(paymentIntentId: string): Promise<PaymentStatusUpdate> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status as PaymentStatusUpdate['status'],
        lastError: paymentIntent.last_payment_error?.message,
    };
}

interface CreateConnectAccountParams {
    email: string;
    country: string;
    businessType: 'individual' | 'company';
    businessProfile: {
        name: string;
        url?: string;
        mcc?: string; // Merchant Category Code (e.g., "5812" for restaurants)
    };
}

// Create a Stripe Connect account for a merchant
export async function createConnectAccount(params: CreateConnectAccountParams) {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: params.country,
            email: params.email,
            business_type: params.businessType,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_profile: {
                name: params.businessProfile.name,
                url: params.businessProfile.url,
                mcc: params.businessProfile.mcc || '5812', // Default to restaurants
            },
        });

        // Create an account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${env.NEXT_PUBLIC_APP_URL}/merchant/onboard/refresh`,
            return_url: `${env.NEXT_PUBLIC_APP_URL}/merchant/onboard/complete`,
            type: 'account_onboarding',
        });

        return {
            accountId: account.id,
            onboardingUrl: accountLink.url,
        };
    } catch (error) {
        console.error('Failed to create Connect account:', error);
        throw new Error('Failed to set up merchant account. Please try again.');
    }
}

// Check if a Connect account is properly set up
export async function verifyConnectAccount(accountId: string): Promise<boolean> {
    try {
        const account = await stripe.accounts.retrieve(accountId);
        return (
            account.charges_enabled &&
            account.payouts_enabled &&
            account.capabilities?.card_payments === 'active' &&
            account.capabilities?.transfers === 'active'
        );
    } catch (error) {
        console.error('Failed to verify Connect account:', error);
        return false;
    }
}
