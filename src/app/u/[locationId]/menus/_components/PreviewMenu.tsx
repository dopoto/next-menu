import { DeviceMockup } from '~/components/DeviceMockup';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { Menu } from '~/domain/menus';

export function PreviewMenu(props: { menuItem: Partial<Menu> }) {
    const { name } = props.menuItem;
    return (
        <>
            <DeviceMockup>
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-100 dark:bg-gray-800">
                    <PublicMenuItem
                        item={{
                            name,
                        }}
                    />
                </div>
            </DeviceMockup>
        </>
    );
}
