'use client';

import { Progress } from '~/components/ui/progress';
import { useState, useEffect } from 'react';
import { CompletedOrderCard } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrderCard';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import type { MenuItemId, MenuItem } from '~/domain/menu-items';

const OVERLAY_DURATION_IN_MS = 5000

export type CompletedOrderWithItems = PublicOrderWithItems & { isExpanded: boolean }

export function CompletedOrdersList({
    locationId,
    initialOrders = [],
    menuItemsMap,
}: {
    locationId: LocationId;
    initialOrders: PublicOrderWithItems[];
    menuItemsMap: Map<MenuItemId, MenuItem>;
}) {
    const collapsedOrders: CompletedOrderWithItems[] = initialOrders.map(i => {
        return {
            ...i, isExpanded: false
        }
    });
    const [orders, setOrders] = useState<CompletedOrderWithItems[]>(collapsedOrders);

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
        setOrderOverlayCountdown(prev => new Map(prev).set(orderId, 100));
        setTimeout(() => {
            setOrderOverlayCountdown(prev => {
                const newProgress = new Map(prev);
                newProgress.delete(orderId);
                return newProgress;
            });
        }, OVERLAY_DURATION_IN_MS);
    }

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
            <div className="space-y-4">
                <div className="grid gap-4">
                    {orders
                        .map((order) => (
                            <CompletedOrderCard
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
