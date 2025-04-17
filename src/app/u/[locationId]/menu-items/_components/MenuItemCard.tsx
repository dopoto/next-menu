import { EllipsisVerticalIcon, EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { type LocationId } from '~/lib/location';
import { type MenuItem } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';

export default function MenuItemCard(props: { locationId: LocationId; item: MenuItem }) {
    return (
        <div className="g-2 flex w-full flex-row gap-2   p-2">
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
                        <a href={ROUTES.menuItemsEdit(props.locationId, props.item.id)} title="Delete">
                            <DropdownMenuItem>
                                <Trash2Icon className="text-red-500" />
                                <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
