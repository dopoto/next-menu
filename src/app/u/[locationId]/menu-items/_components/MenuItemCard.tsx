import { type MenuItem } from "~/server/db/schema";

export default function MenuItemCard(props: { item: MenuItem }) {
  return (
    <div className="w-full rounded-sm border-1 p-2">{props.item.name}</div>
  );
}
