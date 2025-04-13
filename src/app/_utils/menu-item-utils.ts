import { MenuItemId, menuItemIdSchema } from "~/app/_domain/menu-items";
import { AppError } from "~/lib/error-utils.server";

export function getValidMenuItemIdOrThrow(candidate?: string): MenuItemId {
  const validationResult = menuItemIdSchema.safeParse(candidate);
  if (!validationResult.success) {
    throw new AppError({
      internalMessage: `Menu Item Id validation failed for ${JSON.stringify(candidate)}`,
    });
  }
  return validationResult.data;
}
