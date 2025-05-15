'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import type { z } from 'node_modules/zod/lib/external';
import { menuFormSchema } from '~/domain/menus';
import { orderFormSchema } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { createOrder } from '~/server/queries/orders';

/**
 * Generates a unique order number using a timestamp and random characters
 */

/**
 * Places an order by storing it in the database and updating the order items status
 */
// export async function placeOrderAction(
//     cartItems: PublicOrderItem[],
//     locationId: LocationId,
// ): Promise<{ orderId: OrderId }> {
//     try {
//         // Filter only draft items for the order
//         const draftItems = cartItems.filter((item) => item.status === 'draft');

//         if (draftItems.length === 0) {
//             throw new Error('No draft items to order');
//         }

//         // Generate a unique order number
//         // In a real implementation, this would be stored in the database
//         const orderId = generateUniqueOrderNumber();

//         console.log(`Creating order ${orderId} for location ${locationId} with ${draftItems.length} items`);

//         // Here we would typically:
//         // 1. Create an order record in the database
//         // 2. Create order item records for each draft item
//         // 3. Update the status of those items to 'ordered'

//         // Since we don't have direct database access in this example,
//         // we're just simulating a successful order creation

//         // In a real implementation, this would be a database transaction

//         // Return the order number so it can be displayed to the user
//         return { orderId };
//     } catch (error) {
//         console.error('Failed to place order:', error);
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         }
//         throw new Error('Failed to place order. Please try again.');
//     }
// }

export const placeOrderAction = async (
    data: z.infer<typeof orderFormSchema>,
): Promise<FormState<typeof menuFormSchema>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'placeOrderAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = orderFormSchema.safeParse(data);
                if (!parsedForm.success) {
                    return processFormErrors(parsedForm.error, data);
                }

                const availableQuota = 1; // TODO = await getAvailableFeatureQuota('menus');
                if (availableQuota <= 0) {
                    return {
                        status: 'error' as const,
                        rootError: 'Out of quota for orders.',
                    };
                }
                const order = await createOrder(parsedForm.data);

                // TODO: revalidatePath(ROUTES.menus(parsedForm.data.locationId));
                // TODO revalidate public path
                return { status: 'success' as const, orderId: order.id };
            } catch (error) {
                if (error instanceof AppError) {
                    return {
                        status: 'error' as const,
                        rootError: error.publicMessage,
                    };
                } else {
                    return {
                        status: 'error' as const,
                        rootError: 'An error occurred while processing the order.',
                    };
                }
            }
        },
    );
};
