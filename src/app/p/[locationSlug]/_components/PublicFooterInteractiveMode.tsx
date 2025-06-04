'use client';

import NumberFlow from '@number-flow/react';
import { useAtom } from 'jotai';
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { placeOrderAction } from '~/app/actions/placeOrderAction';
import { updateOrderAction } from '~/app/actions/updateOrderAction';
import { OrderItemsList } from '~/app/p/[locationSlug]/_components/OrderItemsList';
import { PublicFooterDrawer } from '~/app/p/[locationSlug]/_components/PublicFooterDrawer';
import { menuItemsAtom } from '~/app/p/[locationSlug]/_state/menu-items-atom';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { Labeled } from '~/components/Labeled';
import { Button } from '~/components/ui/button';
import { DrawerClose } from '~/components/ui/drawer';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { useRealTimeOrderUpdates } from '~/hooks/use-real-time';
import { useToast } from '~/hooks/use-toast';
import { getTopPositionedToast } from '~/lib/toast-utils';

function OrderSummaryItem(props: { quantity: number; description: string; children?: React.ReactNode }) {
    const textColor = props.quantity > 0 ? 'text-black' : 'text-gray-500';
    return (
        <div className="flex flex-col items-center-safe">
            <NumberFlow className={`text-5xl font-bold tracking-tighter ${textColor}`} value={props.quantity} />
            <div className={`text-sm truncate antialiased uppercase ${textColor}`}>{props.description}</div>
            <div className="pt-3 pb-3 h-23">{props.children}</div>
        </div>
    );
}

export function PublicFooterInteractiveMode(props: { currencyId: CurrencyId; locationId: LocationId }) {
    const [order, setOrder] = useAtom(orderAtom);
    const [menuItems] = useAtom(menuItemsAtom);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Add real-time updates
    useRealTimeOrderUpdates(order.id, props.locationId);

    //const totalAmount = order.items.reduce((sum, item) => sum + parseFloat(item.menuItem?.price ?? '0'), 0);

    const createOrder = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        try {
            setIsLoading(true);

            const res = await placeOrderAction(order);
            if (res.status === 'success') {
                const orderWithItems = res.fields?.orderWithItems;
                toast({
                    title: 'Order placed successfully',
                    description: `Your order number is ${orderWithItems?.id}`,
                    variant: 'default',
                    className: getTopPositionedToast(),
                });
                setOrder((prevOrder) => {
                    return {
                        ...prevOrder,
                        orderId: orderWithItems?.id ? String(orderWithItems.id) : undefined, //TODO review
                        items: orderWithItems?.items ?? [],
                    };
                });
            } else {
                toast({
                    title: 'Failed to place order',
                    description: 'Please try again',
                    variant: 'destructive',
                    className: getTopPositionedToast(),
                });
            }
        } catch (error) {
            console.error('Failed to place order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrder = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        try {
            setIsLoading(true);

            const res = await updateOrderAction(order);
            if (res.status === 'success') {
                const orderWithItems = res.fields?.orderWithItems;
                toast({
                    title: 'Order updated successfully',
                    description: `Your order number is ${orderWithItems?.id}`,
                    variant: 'default',
                    className: getTopPositionedToast(),
                });
                setOrder((prevOrder) => {
                    return {
                        ...prevOrder,
                        orderId: orderWithItems?.id ? String(orderWithItems.id) : undefined, //TODO review
                        items: orderWithItems?.items ?? [],
                    };
                });
            } else {
                toast({
                    title: 'Failed to update order',
                    description: 'Please try again',
                    variant: 'destructive',
                    className: getTopPositionedToast(),
                });
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const draftItems = order.items.filter((item) => item.orderItem.deliveryStatus == '');
    const inPreparationItems = order.items.filter((item) => item.orderItem.deliveryStatus === 'pending');
    const deliveredItems = order.items.filter((item) => item.orderItem.deliveryStatus === 'delivered');

    const draftItemsSummary = (
        <OrderSummaryItem quantity={draftItems.length} description={'Not ordered yet'}>
            {draftItems.length > 0 &&
                (order.id ? (
                    <Button onClick={updateOrder} disabled={isLoading}>
                        {isLoading ? 'Ordering...' : 'Add to order'}
                    </Button>
                ) : (
                    <Button onClick={createOrder} disabled={isLoading}>
                        {isLoading ? 'Ordering...' : 'Order now!'}
                    </Button>
                ))}
        </OrderSummaryItem>
    );
    const inPreparationItemsSummary = (
        <OrderSummaryItem quantity={inPreparationItems.length} description={'In preparation'}>
            {inPreparationItems.length > 0 && (
                <Image src="/images/Stampede.gif" alt="Hero banner" width={140} height={18} />
            )}
        </OrderSummaryItem>
    );
    const deliveredItemsSummary = <OrderSummaryItem quantity={deliveredItems.length} description={'Received'} />;

    const collapsedContent = (
        <div className=" flex flex-col w-full h-full p-3">
            <div className="flex flex-row justify-between">
                <Labeled label={'Your order'} text={order.id ?? 'No order number yet'} />
                <ChevronsUpIcon />
            </div>
            <div className="flex flex-row w-full h-full gap-4 items-center-safe justify-center">
                <div className="flex-1">{draftItemsSummary}</div>
                <div className="flex-1">{inPreparationItemsSummary}</div>
                <div className="flex-1">{deliveredItemsSummary}</div>
            </div>
        </div>
    );

    function handleDeleteDraftItem(orderItemTempId: string) {
        setOrder((prevOrder) => {
            const itemIndex = prevOrder.items.findIndex((item) => item.orderItem.tempId === orderItemTempId);
            if (itemIndex === -1) return prevOrder;

            const menuItemId = prevOrder.items[itemIndex]!.menuItemId;
            const name = menuItems.get(menuItemId)?.name ?? 'Unknown item';

            const updatedItems = [...prevOrder.items];
            updatedItems.splice(itemIndex, 1);

            toast({
                title: `${name} was removed from your cart`,
                description: `Press 'Order now!' when you're ready to place your order.`,
                className: getTopPositionedToast(),
            });

            return {
                ...prevOrder,
                items: updatedItems,
            };
        });
    }

    return (
        <PublicFooterDrawer collapsedContent={collapsedContent}>
            <div className="flex flex-col w-full h-full p-3">
                <div className="flex flex-row justify-between">
                    <Labeled label={'Your order'} text={order.id ?? 'No order number yet'} />
                    <DrawerClose>
                        <ChevronsDownIcon />
                    </DrawerClose>
                </div>
                <div className="flex flex-col w-full h-full gap-4 pt-4">
                    <div className="flex flex-row gap-3 md:gap-6 border-b-2 border-b-gray-200">
                        <div className="w-30">{draftItemsSummary}</div>
                        <div>
                            <OrderItemsList items={draftItems} onDelete={handleDeleteDraftItem} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 md:gap-6 border-b-2 border-b-gray-200">
                        <div className="w-30">{inPreparationItemsSummary}</div>
                        <div>
                            <OrderItemsList items={inPreparationItems} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 md:gap-6  ">
                        <div className="w-30">{deliveredItemsSummary}</div>
                        <div>
                            <OrderItemsList items={deliveredItems} />
                        </div>
                    </div>
                </div>
            </div>
        </PublicFooterDrawer>
    );
}
