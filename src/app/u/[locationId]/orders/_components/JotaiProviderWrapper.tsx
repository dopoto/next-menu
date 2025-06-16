'use client';

import { Provider, useSetAtom, useAtomValue } from 'jotai';
import 'jotai-devtools/styles.css';
import { type ReactNode, useEffect } from 'react';
import { type DevToolsProps } from 'jotai-devtools';
import type { ComponentType } from 'react';
import { completedOrdersAtom, menuItemsAtom, openOrdersAtom, isLoadingAtom, type OrderWithExpanded } from '../_state/atoms';
import type { MenuItem } from '~/domain/menu-items';
import type { PublicOrderWithItems } from '~/domain/orders';
import dynamic from 'next/dynamic';

let DevTools: ComponentType<DevToolsProps> | null = null;

if (process.env.NODE_ENV !== 'production') {
    DevTools = dynamic(() => import('../../../../../components/JotaiDevTools')
        .then((mod) => ({ default: mod.DevTools })), { ssr: false });
}

// Use dynamic import for NoSSR
const InitializationWrapper = dynamic(() =>
    Promise.resolve(({ children }: { children: ReactNode }) => {
        const isLoading = useAtomValue(isLoadingAtom);

        if (isLoading) return null;

        return <>{children}</>;
    }),
    { ssr: false }
);

function Initializer(props: {
    openOrders: PublicOrderWithItems[];
    completedOrders: PublicOrderWithItems[];
    menuItems: MenuItem[];
}) {
    const setOpenOrders = useSetAtom(openOrdersAtom);
    const setCompletedOrders = useSetAtom(completedOrdersAtom);
    const setMenuItems = useSetAtom(menuItemsAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);

    useEffect(() => {
        setIsLoading(true);

        try {
            setOpenOrders(props.openOrders.map((order: PublicOrderWithItems) => ({ ...order, isExpanded: true })));
            setCompletedOrders(props.completedOrders.map((order: PublicOrderWithItems) => ({ ...order, isExpanded: false })));
            setMenuItems(new Map(props.menuItems.map((item: MenuItem) => [item.id, item])));
        } catch (error) {
            //TODO
            console.error('Error initializing state:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [props.openOrders, props.completedOrders, props.menuItems, setOpenOrders, setCompletedOrders, setMenuItems, setIsLoading]);

    return null;
}

export default function JotaiProviderWrapper(props: {
    children: ReactNode;
    openOrders: PublicOrderWithItems[];
    completedOrders: PublicOrderWithItems[];
    menuItems: MenuItem[];
}) {
    return (
        <Provider>
            <Initializer
                openOrders={props.openOrders}
                completedOrders={props.completedOrders}
                menuItems={props.menuItems}
            />
            {/* <div suppressHydrationWarning>
                <InitializationWrapper> */}
            {DevTools && <DevTools />}
            {props.children}
            {/* </InitializationWrapper>
            </div> */}
        </Provider>
    );
}
