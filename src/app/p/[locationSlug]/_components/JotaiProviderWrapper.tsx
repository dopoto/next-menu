'use client';

import { Provider, useSetAtom } from 'jotai';
import 'jotai-devtools/styles.css';
import { ReactNode, useEffect } from 'react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/cart';
import { CurrencyId } from '~/domain/currencies';
import { LocationId } from '~/domain/locations';

import type { DevToolsProps } from 'jotai-devtools';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

let DevTools: ComponentType<DevToolsProps> | null = null;

if (process.env.NODE_ENV !== 'production') {
    DevTools = dynamic(() => import('./JotaiDevTools').then((mod) => ({ default: mod.DevTools })), { ssr: false });
}

function Initializer(props: { locationId: LocationId; currencyId: CurrencyId }) {
    const setOrder = useSetAtom(orderAtom);

    useEffect(() => {
        setOrder({ locationId: props.locationId, currencyId: props.currencyId, items: [] });
    }, [props.locationId, setOrder]);

    return null;
}

export default function JotaiProviderWrapper(props: {
    children: ReactNode;
    locationId: LocationId;
    currencyId: CurrencyId;
}) {
    return (
        <Provider>
            <Initializer locationId={props.locationId} currencyId={props.currencyId} />
            {DevTools && <DevTools />}
            {props.children}
        </Provider>
    );
}
