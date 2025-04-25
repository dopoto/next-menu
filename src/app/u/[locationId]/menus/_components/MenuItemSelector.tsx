'use client';

import { useEffect, useState } from 'react';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Input } from '~/components/ui/input';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';

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
                const response = await fetch(`/api/available-menu-items?locationId=${locationId}`);
                if (!response.ok) throw new Error('Failed to fetch menu items');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                toast({
                    title: 'Failed to load menu items',
                    description: error instanceof Error ? error.message : 'Unknown error',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        }
        void loadItems();
    }, [locationId]);

    const filteredItems = items.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()) ?? false);

    return (
        <div className="space-y-4">
            <Input placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
