import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { type CurrencyId } from '~/domain/currencies';
import { type MenuItemWithSortOrder } from '~/domain/menu-items';
import { MenuModeId } from '~/domain/menu-modes';

export async function PublicMenu(props: {
    name: string;
    currencyId: CurrencyId;
    menuMode: MenuModeId;
    items: MenuItemWithSortOrder[];
}) {
    return (
        <>
            <h1>{props.name}</h1>
            {props.items?.map((item) => {
                return (
                    <PublicMenuItem key={item.id} item={item} currencyId={props.currencyId} menuMode={props.menuMode} />
                );
            })}
        </>
    );
}
