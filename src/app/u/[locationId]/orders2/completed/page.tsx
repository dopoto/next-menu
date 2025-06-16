'use client';

import { useAtom } from "jotai";
import { completedOrdersAtom, menuItemsAtom } from "~/app/u/[locationId]/orders2/_state/atoms";

export default function Page() {
    const [completedOrders] = useAtom(completedOrdersAtom)
    const [menuItems] = useAtom(menuItemsAtom)

    return <>completed. {JSON.stringify(menuItems.get(12))}</>
}