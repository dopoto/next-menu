import { DeviceMockup } from '~/components/DeviceMockup';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { type CurrencyId } from '~/domain/currencies';
import { type MenuItem } from '~/domain/menu-items';

export function PreviewMenuItem(props: { menuItem: Partial<MenuItem>; currencyId: CurrencyId }) {
    const { name, description, price, isNew } = props.menuItem;
    return (
        <>
            <DeviceMockup>
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-100 dark:bg-gray-800">
                    <PublicMenuItem
                        item={{
                            name,
                            description,
                            price,
                            isNew,
                        }}
                        currencyId={props.currencyId}
                    />
                </div>
            </DeviceMockup>
        </>
    );
}
