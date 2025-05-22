'use server';

import { type PublicOrderItem } from '~/domain/order-items';
import { type PaymentIntentResponse } from '~/domain/payments';
import { createPaymentIntent, verifyConnectAccount } from '~/lib/payment-utils';
import { getMenuItemsByLocation } from '~/server/queries/menu-items';

export async function createCartPaymentIntent(
    cartItems: PublicOrderItem[],
    locationId: number,
): Promise<PaymentIntentResponse> {
    try {
        if (!locationId) {
            throw new Error('Location ID is required');
        }

        // TODO
        const merchantStripeAccountId = 'acct_1RNsp3CEmU5ANDgp';

        // Verify that the Connect account is properly set up
        const isValidAccount = await verifyConnectAccount(merchantStripeAccountId);
        if (!isValidAccount) {
            throw new Error('Merchant account is not fully set up for payments yet');
        }

        const menuItems = await getMenuItemsByLocation(locationId);

        const totalAmount = cartItems.reduce((sum, item) => {
            const matchedItem = menuItems.find((mi) => mi.id === item.menuItemId);
            const matchedItemPrice = matchedItem ? matchedItem.price : '0'; //TODO handle?
            return sum + parseFloat(matchedItemPrice);
        }, 0);

        const paymentIntent = await createPaymentIntent(totalAmount, merchantStripeAccountId);

        if (!paymentIntent.client_secret) {
            throw new Error('No client secret received from Stripe');
        }
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            merchantStripeAccountId: merchantStripeAccountId,
        };
    } catch (error) {
        console.error('Failed to create cart payment intent:', error);
        if (error instanceof Error) {
            if (error.message.includes('Stripe')) {
                throw new Error('Payment service temporarily unavailable. Please try again.');
            }
            throw new Error(error.message);
        }
        throw new Error('Failed to initiate payment. Please try again.');
    }
}
