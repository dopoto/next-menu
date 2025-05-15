'use client';

import { useAtom } from 'jotai';
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import { useState } from 'react';
import { placeOrderAction } from '~/app/actions/placeOrderAction';
import { OrderItemsList } from '~/app/p/[locationSlug]/_components/OrderItemsList';
import { PublicFooterDrawer } from '~/app/p/[locationSlug]/_components/PublicFooterDrawer';
import { orderAtom } from '~/app/p/[locationSlug]/_state/cart';
import { Labeled } from '~/components/Labeled';
import { Button } from '~/components/ui/button';
import { DrawerClose } from '~/components/ui/drawer';
import { type CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';
import { useToast } from '~/hooks/use-toast';

function OrderSummaryItem(props: { quantity: number; description: string; children?: React.ReactNode }) {
    const textColor = props.quantity > 0 ? 'text-black' : 'text-gray-500';
    return (
        <div className="flex flex-col items-center-safe">
            <div className={`text-7xl font-bold tracking-tighter ${textColor}`}>{props.quantity}</div>
            <div className={`text-sm truncate antialiased uppercase ${textColor}`}>{props.description}</div>
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

    const draftItemsSummary = (
        <OrderSummaryItem quantity={draftItems.length} description={'Not ordered yet'}>
            {draftItems.length > 0 && (
                <Button onClick={processOrder} disabled={isLoading}>
                    {isLoading ? 'Ordering...' : order.orderId ? 'Add to order' : 'Order now!'}
                </Button>
            )}
        </OrderSummaryItem>
    );
    const inPreparationItemsSummary = (
        <OrderSummaryItem quantity={inPreparationItems.length} description={'In preparation'} />
    );
    const deliveredItemsSummary = <OrderSummaryItem quantity={deliveredItems.length} description={'Received'} />;

    const collapsedContent = (
        <div className="flex flex-col w-full h-full p-3">
            <div className="flex flex-row justify-between">
                <Labeled label={'Your order'} text={order.orderId ?? 'No order number yet'} />
                <ChevronsUpIcon />
            </div>
            <div className="flex flex-row w-full h-full gap-4 items-center-safe justify-center">
                <div className="flex-1">{draftItemsSummary}</div>
                <div className="flex-1">{inPreparationItemsSummary}</div>
                <div className="flex-1">{deliveredItemsSummary}</div>
            </div>
        </div>
    );

    return (
        <PublicFooterDrawer collapsedContent={collapsedContent}>
            <div className="flex flex-col w-full h-full p-3">
                <div className="flex flex-row justify-between">
                    <Labeled label={'Your order'} text={order.orderId ?? 'No order number yet'} />
                    <DrawerClose>
                        <ChevronsDownIcon />
                    </DrawerClose>
                </div>
                <div className="flex flex-col w-full h-full gap-4 pt-4">
                    <div className="flex flex-row gap-6 border-b-2 border-b-gray-200">
                        <div className="w-45">{draftItemsSummary}</div>
                        <div>
                            <OrderItemsList items={draftItems} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-6 border-b-2 border-b-gray-200">
                        <div className="w-45">{inPreparationItemsSummary}</div>
                        <div>
                            <OrderItemsList items={inPreparationItems} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-6  ">
                        <div className="w-45">{deliveredItemsSummary}</div>
                        <div>
                            <OrderItemsList items={deliveredItems} />
                        </div>
                    </div>
                </div>
            </div>
        </PublicFooterDrawer>
    );
}
