'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { type MenuItem } from '~/domain/menu-items';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';

interface SortableMenuItemProps {
    item: MenuItem;
}

export function SortableMenuItem({ item }: SortableMenuItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 rounded-md border p-2"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab rounded-md p-1 hover:bg-gray-100"
            >
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-grow">
                <PublicMenuItem
                    item={{
                        name: item.name,
                        description: item.description,
                        price: item.price.toString(),
                        isNew: item.isNew,
                    }}
                />
            </div>
        </div>
    );
} 