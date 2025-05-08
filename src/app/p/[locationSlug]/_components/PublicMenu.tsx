import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { CurrencyId } from '~/domain/currencies';
import { type MenuItemWithSortOrder } from '~/domain/menu-items';

export async function PublicMenu(props: { name: string;  currencyId: CurrencyId; items: MenuItemWithSortOrder[] }) {
    return (
        <>
            <h1>{props.name}</h1>
            {props.items?.map((item) => {
                return <PublicMenuItem key={item.id} item={item} currencyId={props.currencyId} />;
            })}
        </>
    );
}
