'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { editLocationFormSchema, LocationId } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { updateLocation } from '~/server/queries/locations';

export const editLocationAction = async (
    locationId: LocationId, 
    data: z.infer<typeof editLocationFormSchema>,
): Promise<FormState<typeof editLocationFormSchema>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'editLocationAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = editLocationFormSchema.safeParse(data);
                if (!parsedForm.success) {
                    return processFormErrors(parsedForm.error, data);
                }

                await updateLocation(locationId, parsedForm.data);
                
                revalidatePath(`/u/${locationId}/location`);
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
                        rootError: 'An error occurred while saving the location.',
                    };
                }
            }
        },
    );
};
