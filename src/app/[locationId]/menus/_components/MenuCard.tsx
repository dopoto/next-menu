import { type Menu } from "~/server/db/schema";

export default function MenuCard(props: { item: Menu }) {
  return (
    <div className="w-full rounded-sm border-1 p-2">{props.item.name}</div>
  );
}
