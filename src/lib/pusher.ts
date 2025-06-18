import PusherServer from 'pusher';
import PusherClient from 'pusher-js';
import { LocationId } from '~/domain/locations';
import { type OrderId } from '~/domain/orders';
import { env } from '~/env';

// Server-side Pusher instance (only import in server components)
export const getPusherServer = () => {
    if (typeof window !== 'undefined') {
        throw new Error('getPusherServer should only be called on the server side');
    }
    return new PusherServer({
        appId: env.PUSHER_APP_ID,
        key: env.PUSHER_APP_KEY,
        secret: env.PUSHER_APP_SECRET,
        cluster: env.PUSHER_CLUSTER,
        useTLS: true,
    });
};

// Client-side Pusher instance (safe to import anywhere)
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

// Event types
export const EVENTS = {
    ORDER_CREATED: 'order:created',
    ORDER_UPDATED: 'order:updated',
    ORDER_ITEM_CREATED: 'order-item:created',
    ORDER_ITEM_UPDATED: 'order-item:updated',
} as const;

// Channel types
export const CHANNELS = {
    location: (locationId: LocationId) => `location-${locationId}`,
    order: (orderId: OrderId) => `order-${orderId}`,
} as const;
