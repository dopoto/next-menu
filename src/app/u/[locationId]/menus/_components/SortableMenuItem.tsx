'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Button } from '~/components/ui/button';
import { type MenuItem } from '~/domain/menu-items';

interface SortableMenuItemProps {
    item: MenuItem;
    onDelete: () => void;
}

export function SortableMenuItem({ item, onDelete }: SortableMenuItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id,
        data: {
            type: 'menu-item',
            item,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 rounded-md border p-2 touch-none cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            <div className="rounded-md p-1 hover:bg-gray-100 touch-none" aria-label={`Drag to reorder ${item.name}`}>
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-grow touch-none">
                <PublicMenuItem
                    item={{
                        name: item.name,
                        description: item.description,
                        price: item.price.toString(),
                        isNew: item.isNew,
                    }}
                />
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 touch-none"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
