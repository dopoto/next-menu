'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '~/lib/routes';
import { addItemToMenu, updateMenuItemsSortOrder } from '~/server/queries/menu-items';

export async function addItemToMenuAction(menuId: number, menuItemId: number): Promise<{ status: 'success' | 'error'; error?: string }> {
    try {
        await addItemToMenu(menuId, menuItemId);
        revalidatePath(ROUTES.menus(menuId));
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to add item to menu',
        };
    }
}

export async function updateMenuItemsSortOrderAction(menuId: number, menuItemIds: number[]): Promise<{ status: 'success' | 'error'; error?: string }> {
    try {
        await updateMenuItemsSortOrder(menuId, menuItemIds);
        revalidatePath(ROUTES.menus(menuId));
        return { status: 'success' };
    } catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to update sort order',
        };
    }
} 