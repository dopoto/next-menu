'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { type MenuItemId, menuItemFormSchema } from '~/domain/menu-items';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { updateMenuItem } from '~/server/queries/menu-items';

export async function editMenuItem(
    menuItemId: MenuItemId,
    data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
    const parsed = menuItemFormSchema.safeParse(data);
    if (!parsed.success) {
        return processFormErrors(parsed.error, data);
    }

    try {
        await updateMenuItem(menuItemId, parsed.data);
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
