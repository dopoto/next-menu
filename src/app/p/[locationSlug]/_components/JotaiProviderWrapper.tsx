'use client';

import { Provider, useSetAtom } from 'jotai';
import 'jotai-devtools/styles.css';
import { ReactNode, useEffect } from 'react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/order-atom';
import { CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';

import type { DevToolsProps } from 'jotai-devtools';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { menuItemsAtom } from '~/app/p/[locationSlug]/_state/menu-items-atom';
import type { MenuItem } from '~/domain/menu-items';

let DevTools: ComponentType<DevToolsProps> | null = null;

if (process.env.NODE_ENV !== 'production') {
    DevTools = dynamic(() => import('./JotaiDevTools').then((mod) => ({ default: mod.DevTools })), { ssr: false });
}

function Initializer(props: { locationId: LocationId; currencyId: CurrencyId; menuItems: MenuItem[] }) {
    const setOrder = useSetAtom(orderAtom);
    const setMenuItems = useSetAtom(menuItemsAtom);

    useEffect(() => {
        setOrder({ locationId: props.locationId, currencyId: props.currencyId, items: [] });
    }, [props.locationId, setOrder]);

    useEffect(() => {
        setMenuItems(props.menuItems);
    }, [props.menuItems, setMenuItems]);

    return null;
}

export default function JotaiProviderWrapper(props: {
    children: ReactNode;
    locationId: LocationId;
    currencyId: CurrencyId;
    menuItems: MenuItem[];
}) {
    return (
        <Provider>
            <Initializer locationId={props.locationId} currencyId={props.currencyId} menuItems={props.menuItems} />
            {DevTools && <DevTools />}
            {props.children}
        </Provider>
    );
}
