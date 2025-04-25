import { type LocationId } from '~/domain/locations';
import { type MenuItem, type MenuItemId } from '~/domain/menu-items';
import { getMenuItemById, getMenuItemsByMenu } from '~/server/queries/menu-items';

interface MenuItemsDataProps {
    locationId: LocationId;
    menuId?: number;
    menuItemId?: MenuItemId;
    children: (data: { items: MenuItem[]; item: MenuItem | null }) => React.ReactNode;
}

export async function MenuItemsData({ locationId, menuId, menuItemId, children }: MenuItemsDataProps) {
    let items: MenuItem[] = [];
    let item: MenuItem | null = null;

    if (menuId) {
        items = await getMenuItemsByMenu(menuId);
    }

    if (locationId && menuItemId) {
        item = await getMenuItemById(locationId, menuItemId);
    }

    return <>{children({ items, item })}</>;
} 