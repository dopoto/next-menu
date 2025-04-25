'use server';

import { revalidatePath } from 'next/cache';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { menuFormSchema } from '~/domain/menus';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { updateMenu } from '~/server/queries/menus';

export const editMenuAction = async (menuId: number, formData: FormData) => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'editMenuAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = menuFormSchema.safeParse(formData);
                if (!parsedForm.success) {
                    return processFormErrors(parsedForm.error, formData);
                }
                await updateMenu(menuId, parsedForm.data);
                revalidatePath(ROUTES.menus(parsedForm.data.locationId));
                // TODO revalidate public path
                return { status: 'success' };
            } catch (error) {
                if (error instanceof AppError) {
                    return {
                        eventId: error.publicErrorId,
                        errors: [error.publicMessage],
                    };
                } else {
                    return {
                        eventId: 'n/a',
                        errors: ['An error occurred during onboarding.'],
                    };
                }
            }
        },
    );
};
