'use server';

import { revalidatePath } from 'next/cache';
import { type LocationId } from '~/domain/locations';
import { type menuFormSchema, type MenuId } from '~/domain/menus';
import { type FormState } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { deleteMenu } from '~/server/queries/menus';

// TODO Sentry.withServerActionInstrumentation

export async function deleteMenuAction(
    locationId: LocationId,
    menuId: MenuId,
): Promise<FormState<typeof menuFormSchema>> {
    try {
        await deleteMenu(locationId, menuId);
        revalidatePath(ROUTES.menuItems(locationId));
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not delete menu item.',
        };
    }
}
