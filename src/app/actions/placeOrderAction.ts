'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { notifyOrderCreated } from '~/app/api/realtime/notifications';
import { type menuFormSchema } from '~/domain/menus';
import { orderFormSchema, type PublicOrderWithItems } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { createOrder } from '~/server/queries/orders';

export const placeOrderAction = async (
    data: z.infer<typeof orderFormSchema>,
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
                const orderWithItems = await createOrder(parsedForm.data);

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
