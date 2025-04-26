'use server';

import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { updateMenu } from '~/server/queries/menus';

export const editMenuAction = async (
    menuId: number,
    data: z.infer<typeof menuFormSchema>,
): Promise<FormState<typeof menuFormSchema>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'editMenuAction',
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
                await updateMenu(menuId, parsedForm.data);
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
