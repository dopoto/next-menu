import { NextResponse } from 'next/server';
import { type LocationId } from '~/domain/locations';
import { getAvailableMenuItems } from '~/server/queries/menu-items';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId') as LocationId | null;

    if (!locationId) {
        return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    try {
        const items = await getAvailableMenuItems(locationId);
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch available menu items' }, { status: 500 });
    }
} 