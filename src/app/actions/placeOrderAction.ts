'use server';

import * as Sentry from '@sentry/nextjs';
import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { notifyOrderCreated } from '~/app/api/realtime/notifications';
import { type menuWithItemsFormSchema } from '~/domain/menus';
import { publicOrderWithItemsSchema, type PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';

export const placeOrderAction = async (
    data: z.infer<typeof publicOrderWithItemsSchema>,
): Promise<FormState<typeof menuWithItemsFormSchema, { orderWithItems: PublicOrderWithItems }>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'placeOrderAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = publicOrderWithItemsSchema.safeParse(data);
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
                //const orderWithItems = await createOrder(parsedForm.data);
                const { currencyId, items } = parsedForm.data
                const orderId = await fetchMutation(api.orders.createOrder, {
                    currencyId,
                    items: items?.map((item, index) => ({
                        menuItemId: String(item.menuItemId) as Id<"menuItems">,
                        sortOrderIndex: index,
                    })),
                });                // Construct the order object for notification
                const orderWithItems: PublicOrderWithItems = {
                    id: parseInt(orderId.slice(orderId.indexOf('_') + 1)), // Convert Convex ID to number
                    locationId: parsedForm.data.locationId,
                    currencyId: parsedForm.data.currencyId,
                    createdAt: new Date(),

                    items: items?.map((item, index) => ({
                        menuItemId: item.menuItemId,
                        orderItem: {
                            // Use undefined or a placeholder string for id, as OrderItemId is likely a string type
                            id: undefined,
                            deliveryStatus: 'pending',
                            isPaid: false,
                        }
                    })) ?? [],
                };

                await notifyOrderCreated(parsedForm.data.locationId, orderWithItems);

                return {
                    status: 'success' as const,
                    fields: { orderWithItems },
                };
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
