'use client';

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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
import { addItemToMenu, getMenuItemById, getMenuItemsByMenu, updateMenuItemsSortOrder } from '~/server/queries/menu-items';
import { SortableMenuItem } from '../_components/SortableMenuItem';
import { MenuItemSelector } from './MenuItemSelector';

interface MenuItemsManagerProps {
    locationId: LocationId;
    menuId?: number;
    initialItems?: MenuItem[];
    onItemsChange?: (items: MenuItem[]) => void;
}

export function MenuItemsManager({ locationId, menuId, initialItems = [], onItemsChange }: MenuItemsManagerProps) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showSelectDialog, setShowSelectDialog] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = async (event: { active: { id: number }; over: { id: number } }) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const newItems = arrayMove(
                items,
                items.findIndex((item) => item.id === active.id),
                items.findIndex((item) => item.id === over.id),
            );

            setItems(newItems);
            onItemsChange?.(newItems);

            if (menuId) {
                try {
                    await updateMenuItemsSortOrder(
                        menuId,
                        newItems.map((item) => item.id),
                    );
                } catch (error) {
                    toast({
                        title: 'Failed to update sort order',
                        description: error instanceof Error ? error.message : 'Unknown error',
                        variant: 'destructive',
                    });
                }
            }
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
                try {
                    await addItemToMenu(menuId, res.menuItemId);
                    const updatedItems = await getMenuItemsByMenu(menuId);
                    setItems(updatedItems);
                    onItemsChange?.(updatedItems);
                } catch (error) {
                    toast({
                        title: 'Failed to add item to menu',
                        description: error instanceof Error ? error.message : 'Unknown error',
                        variant: 'destructive',
                    });
                }
            } else {
                // For new menus, we need to fetch the newly created item to add it to the list
                const newItem = await getMenuItemById(locationId, res.menuItemId);
                if (newItem) {
                    const updatedItems = [...items, newItem];
                    setItems(updatedItems);
                    onItemsChange?.(updatedItems);
                }
            }
        } else {
            handleReactHookFormErrors(newMenuItemForm, res);
        }
    };

    const handleSelectItem = async (item: MenuItem) => {
        if (!items.some((i) => i.id === item.id)) {
            if (menuId) {
                try {
                    await addItemToMenu(menuId, item.id);
                    const updatedItems = await getMenuItemsByMenu(menuId);
                    setItems(updatedItems);
                    onItemsChange?.(updatedItems);
                } catch (error) {
                    toast({
                        title: 'Failed to add item to menu',
                        description: error instanceof Error ? error.message : 'Unknown error',
                        variant: 'destructive',
                    });
                }
            } else {
                const updatedItems = [...items, item];
                setItems(updatedItems);
                onItemsChange?.(updatedItems);
            }
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
                        <MenuItemSelector locationId={locationId} onSelect={handleSelectItem} />
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
