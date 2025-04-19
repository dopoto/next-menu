'use client';

import { EllipsisVerticalIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { toast } from '~/hooks/use-toast';
import { type LocationId } from '~/lib/location';
import { type MenuItem } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';
import { deleteMenuItem } from '~/app/actions/deleteMenuItem';
import { useState } from 'react';

export default function MenuItemCard(props: { locationId: LocationId; item: MenuItem }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        const result = await deleteMenuItem(props.locationId, props.item.id);
        if (result.status === 'success') {
            toast({ title: 'Menu item deleted' });
            setShowDeleteDialog(false);
        } else {
            toast({ 
                title: 'Could not delete menu item',
                description: result.rootError,
                variant: 'destructive'
            });
        }
    }

    return (
        <>
            <div className="g-2 flex w-full flex-row gap-2 p-2">
                <PublicMenuItem
                    item={{
                        name: props.item.name,
                        description: props.item.description,
                        price: props.item.price.toString(),
                        isNew: props.item.isNew,
                    }}
                />
                <div className="mx-auto flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <EllipsisVerticalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <a href={ROUTES.menuItemsEdit(props.locationId, props.item.id)} title="Edit">
                                <DropdownMenuItem>
                                    <PencilIcon />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </a>
                            <a href={ROUTES.menuItemsEdit(props.locationId, props.item.id)} title="Preview">
                                <DropdownMenuItem>
                                    <EyeIcon />
                                    <span>Preview</span>
                                </DropdownMenuItem>
                            </a>
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                                <Trash2Icon className="text-red-500" />
                                <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Menu Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{props.item.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
