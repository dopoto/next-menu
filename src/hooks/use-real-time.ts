import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { LocationId } from '~/domain/locations';
import { type OrderId, type PublicOrderWithItems } from '~/domain/orders';
import { useToast } from '~/hooks/use-toast';
import { CHANNELS, EVENTS, pusherClient } from '~/lib/pusher';
import { getTopPositionedToast } from '~/lib/toast-utils';

export function useRealTimeOrderUpdates(orderUserFriendlyId: string | undefined, locationId: LocationId) {
    const [order, setOrder] = useAtom(orderAtom);
    const { toast } = useToast();

    useEffect(() => {
        if (!orderUserFriendlyId || !locationId) return;

        // Subscribe to both location-wide and order-specific channels
        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));
        const orderChannel = pusherClient.subscribe(CHANNELS.order(orderUserFriendlyId));

        // Handle new orders in the location
        locationChannel.bind(EVENTS.ORDER_CREATED, () => {
            toast({
                title: 'New Order',
                description: `Order #${orderUserFriendlyId} has been created`,
                className: getTopPositionedToast(),
            });
        });

        // Handle updates to the current order
        orderChannel.bind(EVENTS.ORDER_UPDATED, (data: PublicOrderWithItems) => {
            setOrder(data);
            toast({
                title: 'Order Updated',
                description: `Order #${orderUserFriendlyId} has been updated`,
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
    }, [orderUserFriendlyId, locationId, toast, setOrder, order.currencyId]);
}

export function useRealTimeLocationUpdates(locationId: LocationId) {
    const { toast } = useToast();

    useEffect(() => {
        if (!locationId) return;

        const locationChannel = pusherClient.subscribe(CHANNELS.location(locationId));

        // Handle new orders in the location
        locationChannel.bind(EVENTS.ORDER_CREATED, (data: PublicOrderWithItems) => {
            toast({
                title: 'New Order',
                description: `Order #${data.userFriendlyId} has been created`,
                className: getTopPositionedToast(),
            });
        });

        // Handle updates to any order in the location
        locationChannel.bind(EVENTS.ORDER_UPDATED, (data: PublicOrderWithItems) => {
            toast({
                title: 'Order Updated',
                description: `Order #${data.userFriendlyId} has been updated`,
                className: getTopPositionedToast(),
            });
        });

        return () => {
            locationChannel.unsubscribe();
        };
    }, [locationId, toast]);
}
