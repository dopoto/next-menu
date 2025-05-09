import { DeviceMockup } from '~/components/DeviceMockup';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { type CurrencyId } from '~/domain/currencies';
import { type Menu } from '~/domain/menus';

export function PreviewMenu(props: { menuItem: Partial<Menu>; currencyId: CurrencyId }) {
    const { name } = props.menuItem;
    return (
        <DeviceMockup>
            <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-100 dark:bg-gray-800">
                <PublicMenuItem
                    item={{
                        name,
                    }}
                    currencyId={props.currencyId}
                />
            </div>
        </DeviceMockup>
    );
}
