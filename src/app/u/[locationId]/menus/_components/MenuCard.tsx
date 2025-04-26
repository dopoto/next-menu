'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { deleteMenuAction } from '~/app/actions/deleteMenuAction';
import { Button } from '~/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '~/components/ui/dropdown-menu';
import type { LocationId } from '~/domain/locations';
import { type Menu } from '~/domain/menus';
import { toast } from '~/hooks/use-toast';
import { ROUTES } from '~/lib/routes';

export default function MenuCard(props: { locationId: LocationId; item: Menu }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteMenuAction(props.locationId, props.item.id);
        if (result.status === 'success') {
            toast({ title: 'Menu deleted' });
            setShowDeleteDialog(false);
        } else {
            toast({
                title: 'Could not delete menu.',
                description: result.rootError,
                variant: 'destructive',
            });
        }
        setIsDeleting(false);
    }

    return (
        <div className="w-full rounded-sm border-1 p-2 flex flex-row">
            <div className="grow">{props.item.name}</div>
            <div className="mx-auto flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <EllipsisVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <a href={ROUTES.menusEdit(props.locationId, props.item.id)} title="Edit">
                            <DropdownMenuItem>
                                <PencilIcon />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </a>
                        {/* TODO */}
                        {/* <DropdownMenuItem onClick={() => setShowPreviewDialog(true)}>
                            <EyeIcon />
                            <span>Preview</span>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                            <Trash2Icon className="text-red-500" />
                            <span className="text-red-500">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-2  text-red-500">Delete Menu?</DialogTitle>
                        <DialogDescription className="pb-2">
                            <div className="font-semibold">{props.item.name}</div>
                            <div> Are you sure you want to delete this menu? This action cannot be undone.</div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
