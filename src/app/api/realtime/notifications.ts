import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { CHANNELS, EVENTS, getPusherServer } from '~/lib/pusher';

export async function notifyOrderCreated(locationId: LocationId, order: PublicOrderWithItems) {
    const pusher = getPusherServer();
    // Notify all clients listening to this location about the new order
    await pusher.trigger(CHANNELS.location(locationId), EVENTS.ORDER_CREATED, order);
}

export async function notifyOrderUpdated(locationId: LocationId, order: PublicOrderWithItems) {
    const pusher = getPusherServer();
    // Notify all clients listening to this location about the order update
    await pusher.trigger(CHANNELS.location(locationId), EVENTS.ORDER_UPDATED, order);

    // Also notify clients specifically listening to this order
    await pusher.trigger(CHANNELS.order(order.id), EVENTS.ORDER_UPDATED, order);
}
