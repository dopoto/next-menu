'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { createMenu } from '~/server/queries/menu';

export async function addMenu(
    data: z.infer<typeof menuFormSchema>,
): Promise<FormState<typeof menuFormSchema>> {
    const parsed = menuFormSchema.safeParse(data);
    if (!parsed.success) {
        return processFormErrors(parsed.error, data);
    }

    const availableQuota = await getAvailableFeatureQuota('menus');
    if (availableQuota <= 0) {
        return {
            status: 'error',
            rootError: 'Out of quota for menus.',
        };
    }

    try {
        await createMenu(parsed.data);
        revalidatePath(ROUTES.menus(parsed.data.locationId));
        // TODO revalidate public path
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not save data.',
        };
    }
}
