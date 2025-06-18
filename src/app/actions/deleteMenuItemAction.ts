'use server';

import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';
import { type LocationId } from '~/domain/locations';
import { type MenuItemId, type menuItemFormSchema } from '~/domain/menu-items';
import { type FormState } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';

// TODO Sentry.withServerActionInstrumentation

export async function deleteMenuItemAction(
    locationId: LocationId,
    menuItemId: MenuItemId,
): Promise<FormState<typeof menuItemFormSchema>> {
    try {
        //await deleteMenuItemQuery(locationId, menuItemId);
        await fetchMutation(api.menuItems.deleteMenuItem, {
            menuItemId: String(menuItemId) as Id<"menuItems">
        });
        revalidatePath(ROUTES.menuItems(locationId));
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not delete menu item.',
        };
    }
}
