'use server';

import { type PaymentIntentResponse } from '~/domain/payments';
import { createPaymentIntent, verifyConnectAccount } from '~/lib/payment-utils';

export async function createMenuItemPaymentIntent(
    amount: number,
    merchantStripeAccountId: string,
): Promise<PaymentIntentResponse> {
    try {
        if (!merchantStripeAccountId || !merchantStripeAccountId.startsWith('acct_')) {
            //TODO
            throw new Error('Invalid merchant Stripe account');
        }

        // Verify that the Connect account is properly set up
        const isValidAccount = await verifyConnectAccount(merchantStripeAccountId);
        if (!isValidAccount) {
            throw new Error('Merchant account is not fully set up for payments yet');
        }

        const paymentIntent = await createPaymentIntent(amount, merchantStripeAccountId);

        if (!paymentIntent.client_secret) {
            throw new Error('No client secret received from Stripe');
        }

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    } catch (error) {
        console.error('Failed to create payment intent:', error);
        if (error instanceof Error) {
            if (error.message.includes('Stripe')) {
                throw new Error('Payment service temporarily unavailable. Please try again.');
            }
            throw new Error(error.message);
        }
        throw new Error('Failed to initiate payment. Please try again.');
    }
}
