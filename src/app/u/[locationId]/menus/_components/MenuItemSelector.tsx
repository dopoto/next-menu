'use client';

import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { getAvailableMenuItems } from '~/app/actions/menu-items';

interface MenuItemSelectorProps {
    locationId: LocationId;
    onSelect: (item: MenuItem) => void;
}

export function MenuItemSelector({ locationId, onSelect }: MenuItemSelectorProps) {
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadItems() {
            setIsLoading(true);
            try {
                const availableItems = await getAvailableMenuItems(locationId);
                setItems(availableItems);
            } catch (error) {
                console.error('Failed to load menu items:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadItems();
    }, [locationId]);

    const filteredItems = items.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ?? false
    );

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search menu items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center">Loading...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center">No menu items found</div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
                                onClick={() => onSelect(item)}
                            >
                                <PublicMenuItem
                                    item={{
                                        name: item.name,
                                        description: item.description,
                                        type: item.type,
                                        price: item.price.toString(),
                                        isNew: item.isNew,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 