'use client';

import { useState } from 'react';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Input } from '~/components/ui/input';
import { type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';

interface MenuItemSelectorProps {
    allMenuItems: MenuItem[];
    addedItems: MenuItem[];
    currencyId: CurrencyId;
    onSelect: (item: MenuItem) => void;
}

export function MenuItemSelector({ allMenuItems, addedItems, currencyId, onSelect }: MenuItemSelectorProps) {
    const [search, setSearch] = useState('');

    const filteredItems = (allMenuItems ?? [])
        .filter((item) => addedItems.findIndex((a) => a.id === item.id) === -1)
        .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()) ?? false);

    return (
        <div className="space-y-4">
            <Input placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="space-y-2">
                {filteredItems.length === 0 ? (
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
                                    currencyId={currencyId}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
