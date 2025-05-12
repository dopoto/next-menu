'use client';

import { LoaderIcon, SoupIcon, WineIcon } from 'lucide-react';
import { useState } from 'react';
import { createMenuItemPaymentIntent } from '~/app/actions/createMenuItemPaymentIntent';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';
import { type PaymentIntentResponse } from '~/domain/payments';
import { PaymentButton } from './PaymentButton';

export function PublicMenuItem(props: { item: MenuItem; currencyId: CurrencyId; merchantStripeAccountId: string }) {
    const { name, description, price, isNew, type } = props.item;
    const currency = CURRENCIES[props.currencyId];
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="flex w-full flex-row items-center pt-2 pb-2 text-sm gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                {type === 'dish' ? <SoupIcon /> : <WineIcon />}
            </div>
            <div className="flex flex-col">
                <div className="font-semibold">
                    {name}{' '}
                    {isNew && (
                        <Badge className="uppercase" variant={'default'}>
                            new!
                        </Badge>
                    )}
                </div>
                <div className="text-xs">{description}</div>{' '}
                <div>
                    {price} {currency.symbol}{' '}
                    {paymentIntent ? (
                        <PaymentButton
                            clientSecret={paymentIntent.clientSecret}
                            merchantName={name!}
                            amount={parseFloat(price)}
                            onSuccess={() => {
                                setPaymentIntent(null);
                                setError(null);
                            }}
                            onError={(err) => setError(err.message)}
                        />
                    ) : (
                        <Button
                            variant="link"
                            className="text-xs"
                            disabled={isLoading}
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    setError(null);
                                    const intent = await createMenuItemPaymentIntent(
                                        props.item,
                                        props.merchantStripeAccountId,
                                    );
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
                </div>
                {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
            </div>
        </div>
    );
}
