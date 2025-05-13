'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAtom } from 'jotai';
import { LoaderIcon, MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { createCartPaymentIntent } from '~/app/actions/createCartPaymentIntent';
import { PaymentButton } from '~/components/public/PaymentButton';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { cartAtom } from '~/domain/cart';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';
import { env } from '~/env';
import { useToast } from '~/hooks/use-toast';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function PublicFooter(props: { currencyId: CurrencyId; locationId: LocationId }) {
    const currency = CURRENCIES[props.currencyId];
    const [cart, setCart] = useAtom(cartAtom);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { toast } = useToast();

    const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.menuItem?.price ?? '0') * item.quantity, 0);

    const updateItemQuantity = (itemId: number, delta: number) => {
        setCart(
            cart
                .map((item) => {
                    if (item.menuItem.id !== itemId) return item;
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                })
                .filter((item) => item.quantity > 0),
        );
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const paymentIntent = await createCartPaymentIntent(cart, props.locationId);
            setClientSecret(paymentIntent.clientSecret);
            setIsCheckingOut(true);
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to initiate checkout',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        toast({
            title: 'Success',
            description: 'Payment completed successfully!',
        });
        setCart([]); // Clear cart
        setIsCheckingOut(false);
    };

    const handlePaymentError = (error: Error) => {
        toast({
            title: 'Payment Failed',
            description: error.message,
        });
        setIsCheckingOut(false);
    };

    console.log(JSON.stringify(cart, null, 2));

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="default" className="fixed bottom-4 left-4 h-16 w-16 rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                    {cart.length > 0 && (
                        <span className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-white px-2 py-1 text-sm font-medium text-black">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>
                {cart.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col space-y-4">
                            {cart.map((item) => (
                                <div key={item.menuItem.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.menuItem.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {item.menuItem.price} {currency.symbol} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                item.menuItem.id !== undefined &&
                                                updateItemQuantity(item.menuItem.id, -1)
                                            }
                                        >
                                            <MinusIcon className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                item.menuItem.id !== undefined &&
                                                updateItemQuantity(item.menuItem.id, 1)
                                            }
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
                            <div className="flex items-center justify-between py-4">
                                <span className="text-lg font-medium">Total:</span>
                                <span className="text-lg font-medium">
                                    {totalAmount.toFixed(2)} {currency.symbol}
                                </span>
                            </div>
                            {isCheckingOut && clientSecret ? (
                                <div className="w-full">
                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret,
                                            appearance: { theme: 'stripe' },
                                        }}
                                    >
                                        <PaymentButton
                                            clientSecret={clientSecret}
                                            merchantName="Menu"
                                            amount={totalAmount}
                                            onSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                        />
                                    </Elements>
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
