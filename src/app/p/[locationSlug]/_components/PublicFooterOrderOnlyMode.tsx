'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { PublicFooterDrawer } from '~/app/p/[locationSlug]/_components/PublicFooterDrawer';
import { cartAtom } from '~/domain/cart';
import { CURRENCIES, type CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';
import { useToast } from '~/hooks/use-toast';

function OrderSummaryItem(props: { quantity: number; description: string }) {
    return (
        <div className="flex flex-col items-center-safe">
            <div className="text-7xl font-bold tracking-tighter">{props.quantity}</div>
            <div className="text-tiny truncate antialiased text-gray-400 uppercase">{props.description}</div>
        </div>
    );
}

export function PublicFooterOrderOnlyMode(props: { currencyId: CurrencyId; locationId: LocationId }) {
    const currency = CURRENCIES[props.currencyId];
    const [cart, setCart] = useAtom(cartAtom);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [merchantStripeAccountId, setMerchantStripeAccountId] = useState<string | null>(null);
    const { toast } = useToast();

    const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.menuItem?.price ?? '0'), 0);

    console.log(JSON.stringify(cart, null, 2));

    const draftItems = cart.filter((item) => item.status === 'draft').length;
    const inPreparationItems = cart.filter((item) => item.status === 'ordered').length;
    const deliveredItems = cart.filter((item) => item.status === 'delivered').length;

    const collapsedContent = (
        <div className="flex flex-col w-full h-full ">
            <div className="bg-accent p-2">Your order</div>
            <div className="flex flex-row w-full h-full gap-4 items-center-safe justify-center">
                <div className="flex-1">
                    <OrderSummaryItem quantity={draftItems} description={'Not ordered yet'} />
                </div>
                <div className="flex-1">
                    <OrderSummaryItem quantity={inPreparationItems} description={'In preparation'} />
                </div>
                <div className="flex-1">
                    <OrderSummaryItem quantity={deliveredItems} description={'Received'} />
                </div>
            </div>
        </div>
    );

    return (
        <PublicFooterDrawer collapsedContent={collapsedContent}>
            <div className="grid gap-4">
                <p>This is the content of the drawer. You can put anything here.</p>
                <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">Example Content</h3>
                    <p className="text-sm text-muted-foreground">
                        This could be settings, additional information, or any other content.
                    </p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium">More Content</h3>
                    <p className="text-sm text-muted-foreground">Add as much content as you need here.</p>
                </div>
            </div>
        </PublicFooterDrawer>
    );
}
