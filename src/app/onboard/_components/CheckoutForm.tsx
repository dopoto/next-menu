'use client';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
import { onboardCreateCheckoutSessionAction } from '~/app/actions/onboardCreateCheckoutSessionAction';
import { type PriceTierId } from '~/domain/price-tiers';
import { env } from '~/env';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const CheckoutForm = (props: { priceTierId: PriceTierId }) => {
    const fetchClientSecret = useCallback(async () => {
        const stripeResponse = await onboardCreateCheckoutSessionAction({
            priceTierId: props.priceTierId,
        });
        return stripeResponse.clientSecret;
    }, [props.priceTierId]);

    // TODO preoppulatate wth customer details - e.g. email?

    const options = { fetchClientSecret };

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};
