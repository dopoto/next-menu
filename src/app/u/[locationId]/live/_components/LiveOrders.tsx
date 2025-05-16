'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from '~/app/u/[locationId]/_components/DashboardCard';
import { type LocationId } from '~/domain/locations';
import { type OrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';
import { OrderCard } from './OrderCard';

export function LiveOrders({
    locationId,
    initialOrders = [],
}: {
    locationId: LocationId;
    initialOrders: OrderWithItems[];
}) {
    const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
    const { toast } = useToast();

    // Subscribe to location-wide order updates
    useEffect(() => {
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));

        // Handle new orders
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: OrderWithItems) => {
            setOrders((current) => [...current, data]);
            toast({
                title: 'New Order Received',
                description: `Order #${data.orderId} has been created`,
            });
        });

        // Handle updates to any order
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: OrderWithItems) => {
            setOrders((current) => current.map((order) => (order.orderId === data.orderId ? data : order)));
        });

        return () => {
            try {
                locationChannel.unsubscribe();
            } catch (error) {
                console.error('Error unsubscribing from Pusher channel:', error);
            }
        };
    }, [locationId, toast]);

    const orderedCount = orders.filter((o) => o.items.some((i) => i.status === 'ordered')).length;
    const preparingCount = orderedCount; // For now they're the same
    const deliveredCount = orders.filter((o) => o.items.every((i) => i.status === 'delivered')).length;

    return (
        <div className="flex flex-col space-y-8">
            <div className="flex flex-wrap gap-4">
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
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Active Orders</h2>
                <div className="grid gap-4">
                    {orders
                        .filter((order) => order.items.some((i) => i.status !== 'delivered'))
                        .map((order) => (
                            <OrderCard key={order.orderId} order={order} locationId={locationId} />
                        ))}
                </div>
            </div>
        </div>
    );
}
