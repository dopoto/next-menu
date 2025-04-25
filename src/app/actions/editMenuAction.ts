'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';
import { menuFormSchema } from '~/domain/menus';
import { type FormState, processFormErrors } from '~/lib/form-state';
import { ROUTES } from '~/lib/routes';
import { updateMenu } from '~/server/queries/menus';

export async function editMenuAction(
    menuId: number,
    data: z.infer<typeof menuFormSchema>,
): Promise<FormState<typeof menuFormSchema>> {
    const parsed = menuFormSchema.safeParse(data);
    if (!parsed.success) {
        return processFormErrors(parsed.error, data);
    }

    try {
        await updateMenu(menuId, parsed.data);
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
