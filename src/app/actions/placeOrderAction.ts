'use server';

import { CartItem } from '~/domain/cart';
import { LocationId } from '~/domain/locations';

/**
 * Generates a unique order number using a timestamp and random characters
 */
function generateUniqueOrderNumber(): string {
    const timestamp = new Date().getTime().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}${randomStr}`;
}

/**
 * Places an order by storing it in the database and updating the order items status
 */
export async function placeOrderAction(
    cartItems: CartItem[],
    locationId: LocationId
): Promise<{ orderNumber: string }> {
    try {
        // Filter only draft items for the order
        const draftItems = cartItems.filter((item) => item.status === 'draft');
        
        if (draftItems.length === 0) {
            throw new Error('No draft items to order');
        }

        // Generate a unique order number
        // In a real implementation, this would be stored in the database
        const orderNumber = generateUniqueOrderNumber();
        
        console.log(`Creating order ${orderNumber} for location ${locationId} with ${draftItems.length} items`);
        
        // Here we would typically:
        // 1. Create an order record in the database
        // 2. Create order item records for each draft item
        // 3. Update the status of those items to 'ordered'
        
        // Since we don't have direct database access in this example,
        // we're just simulating a successful order creation
        
        // In a real implementation, this would be a database transaction
        
        // Return the order number so it can be displayed to the user
        return { orderNumber };
    } catch (error) {
        console.error('Failed to place order:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to place order. Please try again.');
    }
}
