'use client';

import { useAtom, useAtomValue } from 'jotai';
import { Progress } from '~/components/ui/progress';
import { Card } from '~/components/ui/card';
import { useEffect, useState } from 'react';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';
import OpenOrderCard from './OpenOrderCard';
import type { MenuItemId, MenuItem } from '~/domain/menu-items';
import { menuItemsAtom, openOrdersAtom, sortedOpenOrdersAtom, isLoadingAtom, type OrderWithExpanded } from '../../_state/atoms';

const OVERLAY_DURATION_IN_MS = 5000

export function OpenOrdersList({
    locationId,
}: {
    locationId: LocationId;
}) {
    const [orders, setOrders] = useAtom(openOrdersAtom);
    const sortedOrders = useAtomValue(sortedOpenOrdersAtom);
    const menuItemsMap = useAtomValue(menuItemsAtom);
    const isLoading = useAtomValue(isLoadingAtom);
    const { toast } = useToast();

    // Track orders where the user changes delivery status, so we can show a 
    // confirmation overlay on them for a few seconds.
    const [orderOverlayCountdown, setOrderOverlayCountdown] = useState<Map<PublicOrderWithItems["id"], number>>(new Map());

    function toggleExpanded(orderId: number) {
        const newOrders = orders.map(order =>
            order.id === orderId
                ? { ...order, isExpanded: !order.isExpanded }
                : order
        );
        setOrders(newOrders);
    }

    function handleItemStatusChanged(orderId: number) {
        const isOrderStillInProgress = orders.find(o => o.id === orderId)?.items.some(i => i.orderItem.deliveryStatus === 'pending')
        console.log(orderId, isOrderStillInProgress);
        if (isOrderStillInProgress) return;

        setOrderOverlayCountdown(prev => new Map(prev).set(orderId, 100));
        setTimeout(() => {
            setOrderOverlayCountdown(prev => {
                const newProgress = new Map(prev);
                newProgress.delete(orderId);
                return newProgress;
            });
        }, OVERLAY_DURATION_IN_MS);
    }

    // Subscribe to location-wide order updates
    useEffect(() => {
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));

        // Handle new orders
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: OrderWithExpanded) => {
            setOrders((current) => [...current, data]);
            toast({
                title: 'New Order Received',
                description: `Order #${data.id} has been created`,
            });
        });

        // Handle updates to any order
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: OrderWithExpanded) => {
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

    useEffect(() => {
        const orderIds = Array.from(orderOverlayCountdown.keys());
        if (orderIds.length === 0) return;

        const duration = OVERLAY_DURATION_IN_MS;
        const interval = 50; // Update every 50ms
        const steps = duration / interval;
        const decrementPerStep = Math.ceil(100 / steps); // Round up to ensure we reach 0

        const timer = setInterval(() => {
            setOrderOverlayCountdown(prev => {
                const newProgress = new Map(prev);
                let hasUpdates = false;

                for (const orderId of orderIds) {
                    const currentProgress = Math.round(prev.get(orderId) ?? 0);
                    let newValue = Math.max(0, currentProgress - decrementPerStep);

                    // Ensure we don't get stuck due to rounding
                    if (newValue < decrementPerStep) {
                        newValue = 0;
                    }

                    if (newValue === 0) {
                        newProgress.delete(orderId);
                        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
                    } else {
                        newProgress.set(orderId, newValue);
                        hasUpdates = true;
                    }
                }

                if (!hasUpdates) {
                    clearInterval(timer);
                }

                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [Array.from(orderOverlayCountdown.keys()).join(',')]);

    return (
        <div className="flex flex-col space-y-8">
            <div className="space-y-4">                <div className="grid gap-4">
                {isLoading ? (
                    // Loading skeleton - show 3 skeleton cards
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                            </div>
                        </Card>
                    ))
                ) : sortedOrders.map((order) => (
                    <OpenOrderCard
                        key={order.id}
                        order={order}
                        locationId={locationId}
                        menuItemsMap={menuItemsMap}
                        overlayComponent={orderOverlayCountdown.has(order.id) ? (
                            <div className="w-full absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center  z-50">
                                <div className="w-full max-w-xs flex flex-col gap-1 ">
                                    <p className="font-bold">Delivery status changed</p>
                                    <p className="pb-3">Order #{order.id} will now move to Open Orders.</p>
                                    <Progress value={orderOverlayCountdown.get(order.id)} className="w-full" />
                                </div>
                            </div>
                        ) : null}
                        onToggleExpanded={() => toggleExpanded(order.id)}
                        onItemStatusChanged={() => handleItemStatusChanged(order.id)}
                    />
                ))}
            </div>
            </div>
        </div>
    );
}
