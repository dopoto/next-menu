import { Button } from '~/components/ui/button';
import { type LocationId } from '~/lib/location';
import { type MenuItem } from '~/lib/menu-items';
import { ROUTES } from '~/lib/routes';

export default function MenuItemCard(props: { locationId: LocationId; item: MenuItem }) {
    return (
        <div className="flex w-full flex-col rounded-sm border-1 p-2">
            <div>{props.item.name}</div>
            <a href={ROUTES.menuItemsEdit(props.locationId, props.item.id)}>
                <Button>Edit</Button>
            </a>
        </div>
    );
}
