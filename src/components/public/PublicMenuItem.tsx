import { type MenuItem } from "~/lib/menu-items";
import { Badge } from "~/components/ui/badge";

export function PublicMenuItem(props: { item: Partial<MenuItem> }) {
  const { name, description, price, isNew } = props.item;
  return (
    <div className="flex w-full flex-row border-t-2 border-b-2 border-dotted border-gray-300 p-2 text-sm">
      <div className="flex flex-col">
        <div className="font-semibold">
          {name}{" "}
          {isNew && (
            <Badge className="uppercase" variant={"default"}>
              new!
            </Badge>
          )}
        </div>
        <div className="text-xs">{description}</div>
      </div>
      <div className="ml-auto">{price}</div>
    </div>
  );
}
