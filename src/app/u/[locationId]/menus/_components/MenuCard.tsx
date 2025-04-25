'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '~/components/ui/dropdown-menu';
import type { LocationId } from '~/domain/locations';
import { type Menu } from '~/domain/menus';
import { ROUTES } from '~/lib/routes';

export default function MenuCard(props: { locationId: LocationId; item: Menu }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        // const result = await deleteMenuAction(props.locationId, props.item.id);
        // if (result.status === 'success') {
        //     toast({ title: 'Menu item deleted' });
        //     setShowDeleteDialog(false);
        // } else {
        //     toast({
        //         title: 'Could not delete menu item',
        //         description: result.rootError,
        //         variant: 'destructive',
        //     });
        // }
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
    );
}
