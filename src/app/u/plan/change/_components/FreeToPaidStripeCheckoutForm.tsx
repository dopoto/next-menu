'use client';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
import { changePlanFreeToPaidCreateCheckoutSessionAction } from '~/app/actions/changePlanFreeToPaidCreateCheckoutSessionAction';
import { type PriceTierId } from '~/domain/price-tiers';
import { env } from '~/env';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const FreeToPaidStripeCheckoutForm = (props: {
    fromTierId: PriceTierId;
    toTierId: PriceTierId;
    newStripeCustomerId: string;
}) => {
    const { fromTierId, toTierId, newStripeCustomerId } = props;
    const fetchClientSecret = useCallback(async () => {
        const stripeResponse = await changePlanFreeToPaidCreateCheckoutSessionAction({
            fromTierId,
            toTierId,
            newStripeCustomerId,
        });
        return stripeResponse.clientSecret;
    }, [fromTierId, newStripeCustomerId, toTierId]);

    const options = { fetchClientSecret };

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};
