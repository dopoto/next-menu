'use client';

import type { InferSelectModel } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';
import { type menuItems } from '~/server/db/schema';
import { OrderCard } from './OrderCard';

export function LiveOrders({
    locationId,
    initialOrders = [],
    menuItemsMap,
}: {
    locationId: LocationId;
    initialOrders: PublicOrderWithItems[];
    menuItemsMap: Map<number, InferSelectModel<typeof menuItems>>;
}) {
    const [orders, setOrders] = useState<PublicOrderWithItems[]>(initialOrders);
    const { toast } = useToast();

    // Subscribe to location-wide order updates
    useEffect(() => {
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));

        // Handle new orders
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: PublicOrderWithItems) => {
            console.log(`DBG-EVENTS.ORDER_CREATED`);
            setOrders((current) => [...current, data]);
            toast({
                title: 'New Order Received',
                description: `Order #${data.id} has been created`,
            });
        });

        // Handle updates to any order
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: PublicOrderWithItems) => {
            console.log(`DBG-EVENTS.ORDER_UPDATED`);
            setOrders((current) => current.map((order) => (order.id === data.id ? data : order)));
        });

        return () => {
            try {
                locationChannel.unsubscribe();
            } catch (error) {
                console.error('Error unsubscribing from Pusher channel:', error);
            }
        };
    }, [locationId, toast]);

    // const orderedCount = orders.filter((o) => o.items.some((i) => i.status === 'ordered')).length;
    // const preparingCount = orderedCount; // For now they're the same
    // const deliveredCount = orders.filter((o) => o.items.every((i) => i.status === 'delivered')).length;

    return (
        <div className="flex flex-col space-y-8">
            {/* <div className="flex flex-wrap gap-4">
                <DashboardCard
                    title="New Orders"
                    value={orderedCount.toString()}
                    secondaryValue="Waiting to be prepared"
                />
                <DashboardCard
                    title="In Preparation"
                    value={preparingCount.toString()}
                    secondaryValue="Being prepared"
                />
                <DashboardCard title="Delivered" value={deliveredCount.toString()} secondaryValue="Completed orders" />
            </div> */}

            <div className="space-y-4">
                <div className="grid gap-4">
                    {orders
                        .filter((order) => order.items.some((i) => i.orderItem.isDelivered === false))
                        .map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                locationId={locationId}
                                menuItemsMap={menuItemsMap}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
