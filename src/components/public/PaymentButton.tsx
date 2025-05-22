l'use client';

import { Elements, PaymentElement, PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type PaymentRequest, type StripeElementsOptions } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { env } from '~/env';

// Initialize Stripe with the platform's publishable key
const initStripe = (merchantStripeAccountId: string) =>
    loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
        stripeAccount: merchantStripeAccountId,
    });

export interface PaymentButtonProps {
    clientSecret: string;
    merchantName: string;
    amount: number;
    merchantStripeAccountId: string;
    onSuccess: () => void;
    onError: (error: Error) => void;
}

function PaymentRequestButton({ clientSecret, merchantName, amount, onSuccess, onError }: PaymentButtonProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
    const [showCardForm, setShowCardForm] = useState(false);
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

        pr.canMakePayment()
            .then((result) => {
                console.log('Payment Request capability check result:', result);
                if (result) {
                    console.log('Available payment methods:', {
                        applePay: result.applePay,
                        googlePay: result.googlePay,
                    });
                    setPaymentRequest(pr);
                } else {
                    console.log('No digital wallet payment methods available');
                    setShowCardForm(true);
                }
            })
            .catch((error) => {
                console.error('Error checking payment capability:', error);
                setShowCardForm(true);
            });

        pr.on('paymentmethod', async (e) => {
            try {
                setIsProcessing(true);
                if (!stripe) {
                    throw new Error('Stripe not initialized');
                }
                const { error } = await stripe.confirmCardPayment(
                    clientSecret,
                    {
                        payment_method: e.paymentMethod.id,
                    },
                    { handleActions: false },
                );

                if (error) {
                    e.complete('fail');
                    onError(new Error(error.message));
                } else {
                    e.complete('success');
                    onSuccess();
                }
            } catch (err) {
                e.complete('fail');
                onError(err instanceof Error ? err : new Error('Payment failed'));
            } finally {
                setIsProcessing(false);
            }
        });

        return () => {
            pr.off('paymentmethod');
        };
    }, [stripe, elements, amount, clientSecret, merchantName, onError, onSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
            });

            if (error) {
                onError(new Error(error.message));
            } else {
                onSuccess();
            }
        } catch (err) {
            onError(err instanceof Error ? err : new Error('Payment failed'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            {paymentRequest && (
                <div className="mb-4">
                    <PaymentRequestButtonElement options={{ paymentRequest }} className="w-full" />
                    <div className="mt-4 text-center text-sm text-gray-500">or pay with card below</div>
                </div>
            )}

            {showCardForm && (
                <form onSubmit={handleSubmit}>
                    <PaymentElement />
                    <Button type="submit" disabled={isProcessing || !stripe || !elements} className="mt-4 w-full">
                        {isProcessing ? 'Processing...' : 'Pay now'}
                    </Button>
                </form>
            )}
        </div>
    );
}

export function PaymentButton(props: PaymentButtonProps) {
    const options: StripeElementsOptions = {
        clientSecret: props.clientSecret,
        appearance: { theme: 'stripe' as const },
    };

    return (
        <Elements stripe={initStripe(props.merchantStripeAccountId)} options={options}>
            <PaymentRequestButton {...props} />
        </Elements>
    );
}
