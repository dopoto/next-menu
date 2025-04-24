'use client';

import { EllipsisVerticalIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { deleteMenuItem } from '~/app/actions/deleteMenuItem';
import { PreviewMenuItem } from '~/app/u/[locationId]/menu-items/_components/PreviewMenuItem';
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
import { type LocationId } from '~/domain/locations';
import { type MenuItem } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';
import { ROUTES } from '~/lib/routes';

export default function MenuItemCard(props: { locationId: LocationId; item: MenuItem }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteMenuItem(props.locationId, props.item.id);
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
                            <DropdownMenuItem onClick={() => setShowPreviewDialog(true)}>
                                <EyeIcon />
                                <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                                <Trash2Icon className="text-red-500" />
                                <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="bg-blend-color">
                    <DialogHeader>
                        <DialogTitle>Preview Menu Item</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <PreviewMenuItem
                        menuItem={{
                            name: props.item.name,
                            description: props.item.description,
                            price: props.item.price.toString(),
                            isNew: props.item.isNew,
                        }}
                    />
                </DialogContent>
            </Dialog>

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
