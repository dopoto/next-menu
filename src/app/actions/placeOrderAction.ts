'use server';

import * as Sentry from '@sentry/nextjs';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { notifyOrderCreated } from '~/app/api/realtime/notifications';
import { type menuFormSchema } from '~/domain/menus';
import { publicOrderWithItemsSchema, type PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';

export const placeOrderAction = async (
    data: z.infer<typeof publicOrderWithItemsSchema>,
): Promise<FormState<typeof menuFormSchema, { orderWithItems: PublicOrderWithItems }>> => {
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
                const orderWithItems = await fetchMutation(api.orders.createOrder, {
                    // currencyId: CurrencyId;
                    // locationId: number;
                    // items: PublicOrderItem[];
                    // id?: number | undefined;
                    currencyId,
                    items: items?.map((item, index) => ({
                        menuItemId: String(item.menuItemId) as Id<"menuItems">,
                        sortOrderIndex: index,
                    })),
                });

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
