'use client';

import type { InferSelectModel } from 'drizzle-orm';
import { useState } from 'react';
import { CompletedOrderCard } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrderCard';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { type menuItems } from '~/server/db/schema';

export type ExpandableOrderWithItems = PublicOrderWithItems & { isExpanded: boolean }

export function CompletedOrders({
    locationId,
    initialOrders = [],
    menuItemsMap,
}: {
    locationId: LocationId;
    initialOrders: PublicOrderWithItems[];
    menuItemsMap: Map<number, InferSelectModel<typeof menuItems>>;
}) {
    const init: ExpandableOrderWithItems[] = initialOrders.map(i => { return { ...i, isExpanded: false } });
    console.log(JSON.stringify(init, null, 2))
    const [orders, setOrders] = useState<ExpandableOrderWithItems[]>(init);

    function toggleExpanded(orderId: number) {
        const newOrders = orders.map(order =>
            order.id === orderId
                ? { ...order, isExpanded: !order.isExpanded }
                : order
        );
        setOrders(newOrders);
    }

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
                                onToggleExpanded={() => toggleExpanded(order.id)} />
                        ))}
                </div>
            </div>
        </div>
    );
}
