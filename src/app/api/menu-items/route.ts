import { NextResponse } from 'next/server';
import { type LocationId } from '~/domain/locations';
import { type MenuItemId } from '~/domain/menu-items';
import { getMenuItemById, getMenuItemsByMenu } from '~/server/queries/menu-items';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId') as LocationId | null;
    const menuItemId = searchParams.get('menuItemId') as MenuItemId | null;
    const menuId = searchParams.get('menuId');

    if (menuId) {
        try {
            const items = await getMenuItemsByMenu(Number(menuId));
            return NextResponse.json(items);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
        }
    }

    if (locationId && menuItemId) {
        try {
            const item = await getMenuItemById(locationId, menuItemId);
            return NextResponse.json(item);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
} 