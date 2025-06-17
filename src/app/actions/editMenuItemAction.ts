'use server';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { type MenuItemId, menuItemFormSchema } from '~/domain/menu-items';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { validateAndFormatMenuItemData } from '~/lib/menu-item-utils';
import { ROUTES } from '~/lib/routes';

// TODO Sentry.withServerActionInstrumentation

export async function editMenuItemAction(
    menuItemId: MenuItemId,
    data: z.infer<typeof menuItemFormSchema>,
): Promise<FormState<typeof menuItemFormSchema>> {
    const parsed = menuItemFormSchema.safeParse(data);
    if (!parsed.success) {
        return processFormErrors(parsed.error, data);
    }

    try {
        const { name, description, imageId, price } = validateAndFormatMenuItemData(parsed.data);
        await fetchMutation(api.menuItems.updateMenuItem, {
            menuItemId: String(menuItemId) as Id<"menuItems">,
            name,
            price,
            description,
            imageId
        });
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
