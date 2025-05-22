'use client';

import { useAtom } from 'jotai';
import { LoaderIcon, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { createCartPaymentIntent } from '~/app/actions/createCartPaymentIntent';
import { menuItemsAtom } from '~/app/p/[locationSlug]/_state/menu-items-atom';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { PaymentButton } from '~/components/public/PaymentButton';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { useToast } from '~/hooks/use-toast';
import { getTopPositionedToast } from '~/lib/toast-utils';

export function PublicFooterInteractiveMode(props: { currencyId: CurrencyId; locationId: LocationId }) {
    const currency = CURRENCIES[props.currencyId];
    const [order] = useAtom(orderAtom);
    const [menuItems] = useAtom(menuItemsAtom);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [merchantStripeAccountId, setMerchantStripeAccountId] = useState<string | null>(null);
    const { toast } = useToast();

    const totalAmount = 0; // TODO order.items.reduce((sum, item) => sum + parseFloat(item.menuItem?.price ?? '0'), 0);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const paymentIntent = await createCartPaymentIntent(order.items, props.locationId);
            setClientSecret(paymentIntent.clientSecret);
            setMerchantStripeAccountId(paymentIntent.merchantStripeAccountId);
            setIsCheckingOut(true);
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to initiate checkout',
                className: getTopPositionedToast(),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        toast({
            title: 'Success',
            description: 'Payment completed successfully!',
            className: getTopPositionedToast(),
        });
        //setOrder( );
        setIsCheckingOut(false);
    };

    const handlePaymentError = (error: Error) => {
        toast({
            title: 'Payment Failed',
            description: error.message,
            className: getTopPositionedToast(),
        });
        setIsCheckingOut(false);
    };

    console.log(JSON.stringify(order, null, 2));

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="default" className="fixed bottom-4 left-4 h-16 w-16 rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                    {order.items.length > 0 && (
                        <span className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-white px-2 py-1 text-sm font-medium text-black">
                            {order.items.reduce((sum, item) => {
                                const { price } = menuItems.get(item.menuItemId) ?? { price: '0' };
                                return sum + Number(price);
                            }, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>
                {order.items.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col space-y-4">
                            {order.items.map((item) => {
                                const menuItem = menuItems.get(item.menuItemId);
                                if (!menuItem) return null;
                                const { name, price } = menuItem;
                                return (
                                    <div key={item.menuItemId} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{name}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {price} {currency.symbol}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="w-8 text-center">1</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
                            <div className="flex items-center justify-between py-4">
                                <span className="text-lg font-medium">Total:</span>
                                <span className="text-lg font-medium">
                                    {totalAmount.toFixed(2)} {currency.symbol}
                                </span>
                            </div>
                            {isCheckingOut && clientSecret && merchantStripeAccountId ? (
                                <div className="w-full">
                                    <PaymentButton
                                        clientSecret={clientSecret}
                                        merchantName="Menu"
                                        amount={totalAmount}
                                        merchantStripeAccountId={merchantStripeAccountId}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                    />
                                </div>
                            ) : (
                                <Button className="w-full" disabled={isLoading} onClick={handleCheckout}>
                                    {isLoading ? (
                                        <>
                                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Checkout'
                                    )}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
