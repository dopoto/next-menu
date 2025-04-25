'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { createMenu } from '~/server/queries/menus';

export async function addMenuAction(data: z.infer<typeof menuFormSchema>): Promise<FormState<typeof menuFormSchema>> {
    const parsedForm = menuFormSchema.safeParse(data);
    if (!parsedForm.success) {
        return processFormErrors(parsedForm.error, data);
    }

    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return {
            status: 'error',
            rootError: 'Out of quota for menus.',
        };
    }

    try {
        await createMenu(parsedForm.data);
        revalidatePath(ROUTES.menus(parsedForm.data.locationId));
        // TODO revalidate public path
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not save data.',
        };
    }
}
