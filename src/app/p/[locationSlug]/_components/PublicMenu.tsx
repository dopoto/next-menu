import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { MenuItemWithSortOrder } from '~/domain/menu-items';

export async function PublicMenu(props: { name: string; items: MenuItemWithSortOrder[] }) {
    return (
        <>
            <h1>{props.name}</h1>
            {props.items?.map((item) => {
                return <PublicMenuItem key={item.id} item={item} />;
            })}
        </>
    );
}
