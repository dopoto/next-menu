'use client';

import { Progress } from '~/components/ui/progress';
import type { InferSelectModel } from 'drizzle-orm';
import { useState } from 'react';
import { CompletedOrderCard } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrderCard';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { type menuItems } from '~/server/db/schema';

export type CompletedOrderWithItems = PublicOrderWithItems & { isExpanded: boolean, hasBeenMarkedAsUncompleted: boolean }

export function CompletedOrders({
    locationId,
    initialOrders = [],
    menuItemsMap,
}: {
    locationId: LocationId;
    initialOrders: PublicOrderWithItems[];
    menuItemsMap: Map<number, InferSelectModel<typeof menuItems>>;
}) {
    const init: CompletedOrderWithItems[] = initialOrders.map(i => {
        return {
            ...i, isExpanded: false, hasBeenMarkedAsUncompleted: true
        }
    });
    const [orders, setOrders] = useState<CompletedOrderWithItems[]>(init);

    function toggleExpanded(orderId: number) {
        const newOrders = orders.map(order =>
            order.id === orderId
                ? { ...order, isExpanded: !order.isExpanded }
                : order
        );
        setOrders(newOrders);
    }

    function handleItemStatusChanged(orderId: number) {

    }

    // useEffect(() => {
    //     if (!showProgress) return

    //     const duration = 3000 // 3 seconds
    //     const interval = 50 // Update every 50ms for smooth animation
    //     const decrement = (100 / duration) * interval

    //     const timer = setInterval(() => {
    //         setProgress((prev) => {
    //             const newProgress = prev - decrement
    //             if (newProgress <= 0) {
    //                 clearInterval(timer)
    //                 setShowProgress(false)
    //                 return 0
    //             }
    //             return newProgress
    //         })
    //     }, interval)

    //     return () => clearInterval(timer)
    // }, [showProgress])

    return (
        <div className="flex flex-col space-y-8">
            <div className="space-y-4">
                <div className="grid gap-4">
                    {orders
                        //.filter((order) => order.items.some((i) => i.orderItem.deliveryStatus === 'pending'))
                        .map((order) => (
                            <CompletedOrderCard
                                key={order.id}
                                order={order}
                                locationId={locationId}
                                menuItemsMap={menuItemsMap}
                                overlayComponent={<div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center p-6">
                                    <div className="w-full max-w-xs">
                                        <Progress value={progress} className="w-full" />
                                        <p className="text-center text-sm text-muted-foreground mt-2">
                                            {Math.round(progress)}%
                                        </p>
                                    </div>
                                </div>}
                                onToggleExpanded={() => toggleExpanded(order.id)}
                                onItemStatusChanged={() => handleItemStatusChanged(order.id)}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
