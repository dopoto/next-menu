'use server';

import { api } from '../../../convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { fetchMutation } from 'convex/nextjs';
import { type z } from 'zod';
import { menuItemFormSchema } from '~/domain/menu-items';
import { AppError } from '~/lib/error-utils.server';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { validateAndFormatMenuItemData } from '~/lib/menu-item-utils';
import { getAvailableFeatureQuota } from '~/lib/quota-utils.server-only';

// TODO Sentry.withServerActionInstrumentation

export async function addMenuItemAction(
    data: z.infer<typeof menuItemFormSchema>, //TODO revisit infer
): Promise<FormState<typeof menuItemFormSchema> & { menuItemId?: Id<"menuItems"> }> {
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
        const { locationId, name, description, imageId, price, isNew } = validateAndFormatMenuItemData(parsed.data);
        const menuItemId = await fetchMutation(api.menuItems.createMenuItem, {
            locationId: String(locationId) as Id<"locations">,
            name,
            description,
            imageId,
            price: Number(price), //TODO
            isNew
        });


        if (!menuItemId) {
            throw new AppError({ internalMessage: `Could not save menu item` });
        }
        // TODO revisit revalidate Path
        //revalidatePath(ROUTES.menuItems(parsed.data.locationId));
        // TODO revalidate public path
        return { status: 'success', menuItemId };
    } catch (error) {
        return {
            status: 'error',
            rootError: error instanceof Error ? error.message : 'Could not save data.',
        };
    }
}
