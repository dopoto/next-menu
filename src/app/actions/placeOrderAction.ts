'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { orderFormSchema } from '~/domain/orders';
import { AppError } from '~/lib/error-utils.server';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { createOrder } from '~/server/queries/orders';

export const placeOrderAction = async (
    data: z.infer<typeof orderFormSchema>,
): Promise<FormState<typeof menuFormSchema, { orderId: string }>> => {
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
                return { status: 'success' as const, fields: { orderId: order.id } };
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
