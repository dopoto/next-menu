'use server';

import * as Sentry from '@sentry/nextjs';
import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { locationFormSchema, type LocationId } from '~/domain/locations';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';

export const editLocationAction = async (
    locationId: LocationId,
    data: z.infer<typeof locationFormSchema>,
): Promise<FormState<typeof locationFormSchema>> => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'editLocationAction',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const parsedForm = locationFormSchema.safeParse(data);
                if (!parsedForm.success) {
                    return processFormErrors(parsedForm.error, data);
                }
                const { currencyId, menuMode, name } = parsedForm.data;
                await fetchMutation(api.locations.updateLocation, {
                    locationId: String(locationId) as Id<"locations">,
                    currencyId,
                    menuMode,
                    name,
                });

                // TODO:
                //revalidatePath(`/u/${locationId}/location`);
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
