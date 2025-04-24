'use server';

import { revalidatePath } from 'next/cache';
import { type LocationId } from '~/domain/location';
import { type FormState } from '~/lib/form-state';
import { type menuItemFormSchema, type MenuItemId } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';
import { deleteMenuItem as deleteMenuItemQuery } from '~/server/queries/menu-items';

export async function deleteMenuItem(
    locationId: LocationId,
    menuItemId: MenuItemId,
): Promise<FormState<typeof menuItemFormSchema>> {
    try {
        await deleteMenuItemQuery(locationId, menuItemId);
        revalidatePath(ROUTES.menuItems(locationId));
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not delete menu item.',
        };
    }
}
