import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { type OrderId, type PublicOrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';
import { getTopPositionedToast } from '~/lib/toast-utils';

export function useRealTimeOrderUpdates(orderId: OrderId | undefined, locationId: number) {
    const [order, setOrder] = useAtom(orderAtom);
    const { toast } = useToast();

    useEffect(() => {
        if (!orderId || !locationId) return;

        // Subscribe to both location-wide and order-specific channels
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));
        const orderChannel = pusherClient.subscribe(CHANNELS.order(orderId));

        // Handle new orders in the location
        locationChannel.bind(EVENTS.ORDER_CREATED, () => {
            toast({
                title: 'New Order',
                description: `Order #${orderId} has been created`,
                className: getTopPositionedToast(),
            });
        });

        // Handle updates to the current order
        orderChannel.bind(EVENTS.ORDER_UPDATED, (data: PublicOrderWithItems) => {
            setOrder(data);
            toast({
                title: 'Order Updated',
                description: `Order #${orderId} has been updated`,
                className: getTopPositionedToast(),
            });
        });

        // Handle updates to order items
        orderChannel.bind(EVENTS.ORDER_ITEM_UPDATED, (data: PublicOrderWithItems) => {
            setOrder(data);
        });

        return () => {
            locationChannel.unsubscribe();
            orderChannel.unsubscribe();
        };
    }, [orderId, locationId, toast, setOrder, order.currencyId]);
}

export function useRealTimeLocationUpdates(locationId: number) {
    const { toast } = useToast();

    useEffect(() => {
        if (!locationId) return;

        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));

        // Handle new orders in the location
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: PublicOrderWithItems) => {
            toast({
                title: 'New Order',
                description: `Order #${data.id} has been created`,
                className: getTopPositionedToast(),
            });
        });

        // Handle updates to any order in the location
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: PublicOrderWithItems) => {
            toast({
                title: 'Order Updated',
                description: `Order #${data.id} has been updated`,
                className: getTopPositionedToast(),
            });
        });

        return () => {
            locationChannel.unsubscribe();
        };
    }, [locationId, toast]);
}
