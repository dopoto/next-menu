'use client';

import { DeviceMockup } from '~/app/_components/DeviceMockup';
import { PublicMenuItem } from '~/components/public/PublicMenuItem';
import { type MenuItem } from '~/lib/menu-items';

export function PreviewMenuItem(props: { menuItem: Partial<MenuItem> }) {
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
                    />
                </div>
            </DeviceMockup>
        </>
    );
}
