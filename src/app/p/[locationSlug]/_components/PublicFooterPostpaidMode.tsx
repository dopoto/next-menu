'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { placeOrderAction } from '~/app/actions/placeOrderAction';
import { OrderItemsList } from '~/app/p/[locationSlug]/_components/OrderItemsList';
import { PublicFooterDrawer } from '~/app/p/[locationSlug]/_components/PublicFooterDrawer';
import { orderAtom } from '~/app/p/[locationSlug]/_state/cart';
import { Button } from '~/components/ui/button';
import { type CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';
import { useToast } from '~/hooks/use-toast';

function OrderSummaryItem(props: { quantity: number; description: string; children?: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center-safe">
            <div className="text-7xl font-bold tracking-tighter">{props.quantity}</div>
            <div className="text-tiny truncate antialiased text-gray-400 uppercase">{props.description}</div>
            <div className="pt-3 pb-3 h-23">{props.children}</div>
        </div>
    );
}

export function PublicFooterPostpaidMode(props: { currencyId: CurrencyId; locationId: LocationId }) {
    const [order, setOrder] = useAtom(orderAtom);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const totalAmount = order.items.reduce((sum, item) => sum + parseFloat(item.menuItem?.price ?? '0'), 0);

    const processOrder = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        try {
            setIsLoading(true);

            const res = await placeOrderAction(order);
            if (res.status === 'success') {
                const orderId = res.orderId;
                toast({
                    title: 'Order placed successfully',
                    description: `Your order number is ${orderId}`,
                    variant: 'default',
                });
                setOrder((prevOrder) => {
                    return {
                        ...prevOrder,
                        orderId,
                        items: prevOrder.items.map((item) => {
                            if (item.status === 'draft') {
                                return { ...item, status: 'ordered' };
                            }
                            return item;
                        }),
                    };
                });
            } else {
                toast({
                    title: 'Failed to place order',
                    description: 'Please try again',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Failed to place order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const draftItems = order.items.filter((item) => item.status === 'draft');
    const inPreparationItems = order.items.filter((item) => item.status === 'ordered');
    const deliveredItems = order.items.filter((item) => item.status === 'delivered');

    const collapsedContent = (
        <div className="flex flex-col w-full h-full ">
            <div className="bg-accent p-2">Your order {order.orderId}</div>
            <div className="flex flex-row w-full h-full gap-4 items-center-safe justify-center">
                <div className="flex-1">
                    <OrderSummaryItem quantity={draftItems.length} description={'Not ordered yet'}>
                        {draftItems.length > 0 && (
                            <Button onClick={processOrder} disabled={isLoading}>
                                {isLoading ? 'Ordering...' : 'Order now!'}
                            </Button>
                        )}
                    </OrderSummaryItem>
                </div>
                <div className="flex-1">
                    <OrderSummaryItem quantity={inPreparationItems.length} description={'In preparation'} />
                </div>
                <div className="flex-1">
                    <OrderSummaryItem quantity={deliveredItems.length} description={'Received'} />
                </div>
            </div>
        </div>
    );

    return (
        <PublicFooterDrawer collapsedContent={collapsedContent}>
            <div className="flex flex-col w-full h-full p-3 ">
                <div className="text-left  p-2">Your order {order.orderId}</div>
                <div className="flex flex-col w-full h-full gap-4  ">
                    <div className="flex flex-row gap-4">
                        <div className=" ">
                            <OrderSummaryItem quantity={draftItems.length} description={'Not ordered yet'}>
                                {draftItems.length > 0 && (
                                    <Button onClick={processOrder} disabled={isLoading}>
                                        {isLoading ? 'Ordering...' : 'Order now!'}
                                    </Button>
                                )}
                            </OrderSummaryItem>
                        </div>
                        <div>
                            <OrderItemsList items={draftItems} />
                        </div>
                    </div>
                    {/* <div className="flex-1">
                        <OrderSummaryItem quantity={inPreparationItems} description={'In preparation'} />
                    </div>
                    <div className="flex-1">
                        <OrderSummaryItem quantity={deliveredItems} description={'Received'} />
                    </div> */}
                </div>
            </div>
        </PublicFooterDrawer>
    );
}
