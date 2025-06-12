'use client';

import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { deleteMenuItemAction } from '~/app/actions/deleteMenuItemAction';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Button } from '~/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';
import { ROUTES } from '~/lib/routes';

export default function MenuItemCard(props: { locationId: LocationId; currencyId: CurrencyId; item: MenuItem }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteMenuItemAction(props.locationId, props.item.id);
        if (result.status === 'success') {
            toast({ title: 'Menu item deleted' });
            setShowDeleteDialog(false);
        } else {
            toast({
                title: 'Could not delete menu item',
                description: result.rootError,
                variant: 'destructive',
            });
        }
        setIsDeleting(false);
    }

    const dropdownMenu = (
        <div className="mx-auto flex items-end-safe w-[20px]">
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
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                        <Trash2Icon className="text-red-500" />
                        <span className="text-red-500">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <>
            <div className="flex w-full flex-row">
                <PublicMenuItem
                    item={{
                        id: props.item.id,
                        name: props.item.name,
                        createdAt: props.item.createdAt,
                        updatedAt: props.item.updatedAt,
                        locationId: props.item.locationId,
                        description: props.item.description,
                        imageId: props.item.imageId,
                        price: props.item.price.toString(),
                        type: props.item.type,
                        isNew: props.item.isNew,
                        isPublished: props.item.isPublished,
                    }}
                    currencyId={props.currencyId}
                    menuMode={'noninteractive'}
                    actionComponent={dropdownMenu}
                />
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=" text-red-500">Delete Menu Item?</DialogTitle>
                        <DialogDescription>
                            <div className="font-semibold">{props.item.name}</div>
                            <div> Are you sure you want to delete this menu item? This action cannot be undone.</div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
