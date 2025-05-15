// app/your-page/JotaiProviderWrapper.tsx
'use client';

import { Provider, useSetAtom } from 'jotai';
import 'jotai-devtools/styles.css';
import { ReactNode, useEffect } from 'react';
import { orderAtom } from '~/app/p/[locationSlug]/_state/cart';
import { LocationId } from '~/domain/locations';

function Initializer(props: { locationId: LocationId }) {
    const setOrder = useSetAtom(orderAtom);

    useEffect(() => {
        setOrder({ locationId: props.locationId, items: [] });
    }, [props.locationId, setOrder]);

    return null;
}

export default function JotaiProviderWrapper({
    children,
    locationId,
}: {
    children: ReactNode;
    locationId: LocationId;
}) {
    return (
        <Provider>
            <Initializer locationId={locationId} />
            {children}
        </Provider>
    );
}
