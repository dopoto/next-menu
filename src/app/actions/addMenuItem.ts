'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { menuItemFormSchema } from '~/domain/menu-items';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { createMenuItem } from '~/server/queries/menu-items';

export async function addMenuItem(
    data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
    const parsed = menuItemFormSchema.safeParse(data);
    if (!parsed.success) {
        return processFormErrors(parsed.error, data);
    }

    const availableQuota = await getAvailableFeatureQuota('menuItems');
    if (availableQuota <= 0) {
        return {
            status: 'error',
            rootError: 'Out of quota for menu items.',
        };
    }

    try {
        await createMenuItem(parsed.data);
        revalidatePath(ROUTES.menuItems(parsed.data.locationId));
        // TODO revalidate public path
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not save data.',
        };
    }
}
