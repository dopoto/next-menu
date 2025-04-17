import { DeleteIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { PublicMenuItem } from "~/components/public/PublicMenuItem";
import { Button } from "~/components/ui/button";
import { type LocationId } from "~/lib/location";
import { type MenuItem } from "~/lib/menu-items";
import { ROUTES } from "~/lib/routes";

export default function MenuItemCard(props: {
  locationId: LocationId;
  item: MenuItem;
}) {
  return (
    <div className="g-2 flex w-full flex-col gap-2 rounded-sm border-1 p-2">
      <div>
        <PublicMenuItem
          item={{
            name: props.item.name,
            description: props.item.description,
            price: props.item.price.toString(),
            isNew: props.item.isNew,
          }}
        />
      </div>
      <div className="flex w-full">
        <div>stats</div>
        <div className="ml-auto flex gap-2">
          <a
            href={ROUTES.menuItemsEdit(props.locationId, props.item.id)}
            title="Preview"
          >
            <EyeIcon size="20" />
          </a>

          <a
            href={ROUTES.menuItemsEdit(props.locationId, props.item.id)}
            title="Edit"
          >
            <PencilIcon size="20" />
          </a>

          <a
            href={ROUTES.menuItemsEdit(props.locationId, props.item.id)}
            title="Delete"
          >
            <Trash2Icon size="20" className="stroke-red-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
