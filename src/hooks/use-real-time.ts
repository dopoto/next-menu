import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { orderAtom, type PublicOrder } from '~/app/p/[locationSlug]/_state/cart';
import { type OrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';

const convertToPublicOrder = (order: OrderWithItems, currencyId: string = 'USD'): PublicOrder => ({
    locationId: order.locationId,
    orderId: order.orderId ?? order.id.toString(),
    items: order.items,
    currencyId: currencyId as PublicOrder['currencyId'],
});

export function useRealTimeOrderUpdates(orderId: string | undefined, locationId: number) {
    const [order, setOrder] = useAtom(orderAtom);
    const { toast } = useToast();

    useEffect(() => {
        if (!orderId || !locationId) return;

        // Subscribe to both location-wide and order-specific channels
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));
        const orderChannel = pusherClient.subscribe(CHANNELS.order(orderId));

        // Handle new orders in the location
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: OrderWithItems) => {
            toast({
                title: 'New Order',
                description: `Order #${orderId} has been created`,
            });
        });

        // Handle updates to the current order
        orderChannel.bind(EVENTS.ORDER_UPDATED, (data: OrderWithItems) => {
            setOrder(convertToPublicOrder(data, order.currencyId));
            toast({
                title: 'Order Updated',
                description: `Order #${orderId} has been updated`,
            });
        });

        // Handle updates to order items
        orderChannel.bind(EVENTS.ORDER_ITEM_UPDATED, (data: OrderWithItems) => {
            setOrder(convertToPublicOrder(data, order.currencyId));
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
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: OrderWithItems) => {
            toast({
                title: 'New Order',
                description: `Order #${data.orderId ?? data.id} has been created`,
            });
        });

        // Handle updates to any order in the location
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: OrderWithItems) => {
            toast({
                title: 'Order Updated',
                description: `Order #${data.orderId ?? data.id} has been updated`,
            });
        });

        return () => {
            locationChannel.unsubscribe();
        };
    }, [locationId, toast]);
}
