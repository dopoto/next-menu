'use server';

import * as Sentry from '@sentry/nextjs';
import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { type z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { AppError } from '~/lib/error-utils.server';
import { processFormErrors, type FormState } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';

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
                //await updateMenu(menuId, parsedForm.data);
                const { locationId, name, items } = parsedForm.data;
                await fetchMutation(api.menus.updateMenu, {
                    menuId: String(menuId) as Id<"menus">,
                    name,
                    menuItems: items?.map((item, index) => ({
                        menuItemId: String(item.id) as Id<"menuItems">, // TODO
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
