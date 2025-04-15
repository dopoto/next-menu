import { MenuItem } from "~/lib/menu-items";
import { ROUTES } from "~/lib/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { Button } from "~/components/ui/button";

export default function MenuItemCard(props: {
  locationId: LocationId;
  item: MenuItem;
}) {
  return (
    <div className="flex w-full flex-col rounded-sm border-1 p-2">
      <div>{props.item.name}</div>
      <a href={ROUTES.menuItemsEdit(props.locationId, props.item.id)}>
        <Button>Edit</Button>
      </a>
    </div>
  );
}
