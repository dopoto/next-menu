'use server';

import { Stripe } from 'stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { type PriceTierId, priceTiers } from '../_domain/price-tiers';

const apiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(apiKey);

export const onboardCreateCheckoutSession = async (props: { priceTierId: PriceTierId }) => {
    // TODO

    const tier = priceTiers[props.priceTierId];
    // TODO put in ROUTES:
    const returnUrl = `${env.NEXT_PUBLIC_APP_URL}/onboard/post-payment?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                price: tier.stripePriceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        return_url: returnUrl,
    });

    if (!session.client_secret) {
        throw new AppError({ internalMessage: 'Error initiating Stripe session' });
    }

    return {
        clientSecret: session.client_secret,
    };
};
