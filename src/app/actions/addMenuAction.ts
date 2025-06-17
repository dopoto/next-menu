'use server';

import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { fetchMutation } from "convex/nextjs";
import { api } from 'convex/_generated/api';

export const addMenuAction = async (
    data: z.infer<typeof menuFormSchema>,
): Promise<FormState<typeof menuFormSchema>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'addMenuAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = menuFormSchema.safeParse(data);
                if (!parsedForm.success) {
                    return processFormErrors(parsedForm.error, data);
                }

                const availableQuota = await getAvailableFeatureQuota('menus');
                if (availableQuota <= 0) {
                    return {
                        status: 'error' as const,
                        rootError: 'Out of quota for menus.',
                    };
                }

                await fetchMutation(api.menus.createMenu, {
                    name: data.name,
                    locationId: data.locationId,
                    isPublished: true,
                    items: data.items?.map((item, index) => ({
                        id: item.id,
                        sortOrderIndex: index,
                    })),
                });

                revalidatePath(ROUTES.menus(parsedForm.data.locationId));
                // TODO revalidate public path
                return { status: 'success' as const };
            } catch (error) {
                if (error instanceof AppError) {
                    return {
                        status: 'error' as const,
                        rootError: error.publicMessage,
                    };
                } else {
                    return {
                        status: 'error' as const,
                        rootError: 'An error occurred while saving the menu.',
                    };
                }
            }
        },
    );
};
