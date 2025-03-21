 
import { type Menu } from "~/server/db/schema";

export default function MenuCard(props: { item : Menu }) {
  
  return (
    <div className='w-full rounded-sm p-2  border-1'>{props.item.name}</div>
  );
}
