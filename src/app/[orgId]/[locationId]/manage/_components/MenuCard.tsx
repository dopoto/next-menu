 
import { type Menu } from "~/server/db/schema";

export default function MenuCard(props: { item : Menu }) {
  
  return (
    <div className='w-full rounded-sm p-2 bg-gray-50'>{props.item.name}</div>
  );
}
