'use client';

import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { createMenuItemPaymentIntent } from '~/app/actions/createMenuItemPaymentIntent';
import { Button } from '~/components/ui/button';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import type { MenuItem } from '~/domain/menu-items';
import type { PaymentIntentResponse } from '~/domain/payments';

export function PublicFooter(props: { currencyId: CurrencyId; item: MenuItem; merchantStripeAccountId: string }) {
    const [amount, setAmount] = useState<number | null>(100);

    const currency = CURRENCIES[props.currencyId];
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <div>amount: {amount}</div>
            {amount && amount > 0 && (
                <Button
                    variant="link"
                    className="text-xs"
                    disabled={isLoading}
                    onClick={async () => {
                        try {
                            setIsLoading(true);
                            setError(null);
                            const intent = await createMenuItemPaymentIntent(amount, props.merchantStripeAccountId);
                            setPaymentIntent(intent);
                        } catch (err) {
                            setError(err instanceof Error ? err.message : 'Payment failed');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                >
                    {isLoading ? (
                        <>
                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                            Initializing payment...
                        </>
                    ) : (
                        'Pay'
                    )}
                </Button>
            )}
        </>
    );
}
