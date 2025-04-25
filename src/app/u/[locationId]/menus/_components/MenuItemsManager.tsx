'use client';

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addMenuItemAction } from '~/app/actions/addMenuItemAction';
import { AddEditMenuItemForm } from '~/app/u/[locationId]/menu-items/_components/AddEditMenuItemForm';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { type LocationId } from '~/domain/locations';
import { menuItemFormSchema, type MenuItem } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';
import { handleReactHookFormErrors } from '~/lib/form-state';
import { SortableMenuItem } from '../_components/SortableMenuItem';
import { MenuItemSelector } from './MenuItemSelector';

interface MenuItemsManagerProps {
    locationId: LocationId;
    menuId?: number;
    allMenuItems?: MenuItem[];
    initialItems?: MenuItem[];
    onItemsChange?: (items: MenuItem[]) => void;
}

export function MenuItemsManager({
    locationId,
    menuId,
    allMenuItems = [],
    initialItems = [],
    onItemsChange,
}: MenuItemsManagerProps) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showSelectDialog, setShowSelectDialog] = useState(false);
    const [newMenuItemId, setNewMenuItemId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newItems = arrayMove(
                items,
                items.findIndex((item) => item.id === active.id),
                items.findIndex((item) => item.id === over.id),
            );

            setItems(newItems);
            onItemsChange?.(newItems);

            // if (menuId) {
            //     const res = await updateMenuItemsSortOrderAction(
            //         menuId,
            //         newItems.map((item) => item.id),
            //     );
            //     if (res.status === 'error') {
            //         toast({
            //             title: 'Failed to update sort order',
            //             description: res.error,
            //             variant: 'destructive',
            //         });
            //     }
            // }
        }
    };

    const newMenuItemForm = useForm<typeof menuItemFormSchema._type>({
        resolver: zodResolver(menuItemFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            isNew: false,
            locationId,
        },
    });

    const handleAddNewItem = async (values: typeof menuItemFormSchema._type) => {
        const res = await addMenuItemAction(values);
        if (res.status === 'success' && res.menuItemId) {
            toast({ title: 'Menu item added' });
            setShowAddDialog(false);

            if (menuId) {
                // const addRes = await addItemToMenuAction(menuId, res.menuItemId);
                // if (addRes.status === 'error') {
                //     toast({
                //         title: 'Failed to add item to menu',
                //         description: addRes.error,
                //         variant: 'destructive',
                //     });
                // }
            } else {
                setNewMenuItemId(res.menuItemId);
            }
        } else {
            handleReactHookFormErrors(newMenuItemForm, res);
        }
    };

    const handleSelectItem = async (item: MenuItem) => {
        if (!items.some((i) => i.id === item.id)) {
            const updatedItems = [...items, item];
            setItems(updatedItems);
            onItemsChange?.(updatedItems);
            setShowSelectDialog(false);
        } else {
            setShowSelectDialog(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button>Create new menu item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create new menu item</DialogTitle>
                        </DialogHeader>
                        <AddEditMenuItemForm
                            form={newMenuItemForm}
                            onSubmit={handleAddNewItem}
                            locationId={locationId}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showSelectDialog} onOpenChange={setShowSelectDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add existing menu item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select menu item</DialogTitle>
                        </DialogHeader>
                        <MenuItemSelector allMenuItems={allMenuItems} onSelect={handleSelectItem} />
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <SortableMenuItem key={item.id} item={item} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
