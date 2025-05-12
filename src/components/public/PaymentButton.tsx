'use client';

import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type PaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { env } from '~/env';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
    betas: ['payment_element_beta_1'],
});

export interface PaymentButtonProps {
    clientSecret: string;
    merchantName: string;
    amount: number;
    onSuccess: () => void;
    onError: (error: Error) => void;
}

function PaymentRequestButton({ clientSecret, merchantName, amount, onSuccess, onError }: PaymentButtonProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        if (!stripe || !elements) return;

        const amountInCents = Math.round(amount * 100);
        const pr = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
                label: merchantName,
                amount: amountInCents,
                pending: false,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        pr.canMakePayment().then((result) => {
            if (result) {
                setPaymentRequest(pr);
            }
        });
        pr.on('paymentmethod', async (e) => {
            try {
                setIsProcessing(true);
                if (!stripe) {
                    throw new Error('Stripe not initialized');
                }
                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    clientSecret,
                    {
                        payment_method: e.paymentMethod.id,
                    },
                    { handleActions: false },
                );

                if (error) {
                    e.complete('fail');
                    onError(new Error(error.message));
                    return;
                }

                e.complete('success');
                if (paymentIntent.status === 'requires_action') {
                    if (!stripe) {
                        throw new Error('Stripe not initialized');
                    }
                    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
                    if (confirmError) {
                        onError(new Error(confirmError.message));
                        return;
                    }
                }

                onSuccess();
            } catch (err) {
                e.complete('fail');
                onError(err instanceof Error ? err : new Error('Payment failed'));
            } finally {
                setIsProcessing(false);
            }
        });
        return () => {
            // Clean up event listeners if needed
            pr.off('paymentmethod');
        };
    }, [stripe, elements, clientSecret, merchantName, amount, onSuccess, onError]);

    if (!paymentRequest) {
        return null;
    }

    return (
        <Button onClick={() => paymentRequest.show()} variant="link" className="text-xs" disabled={isProcessing}>
            Pay with Digital Wallet
        </Button>
    );
}

export function PaymentButton(props: PaymentButtonProps) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret: props.clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#0099ff',
                    },
                },
            }}
        >
            <PaymentRequestButton {...props} />
        </Elements>
    );
}
