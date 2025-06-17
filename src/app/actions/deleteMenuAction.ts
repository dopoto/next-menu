'use server';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';
import { type LocationId } from '~/domain/locations';
import { type menuFormSchema, type MenuId } from '~/domain/menus';
import { type FormState } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';

// TODO Sentry.withServerActionInstrumentation

export async function deleteMenuAction(
    locationId: LocationId,
    menuId: MenuId,
): Promise<FormState<typeof menuFormSchema>> {
    try {
        await fetchMutation(api.menus.deleteMenu, {
            menuId: String(menuId) as Id<"menus">
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
