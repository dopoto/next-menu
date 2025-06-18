"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export default function Home() {
    const orders = useQuery(api.orders.getCompletedOrders);
    return (
        <main className="flex  flex-col ">
            {orders?.map(({ _id, locationId }) => <div key={_id}>{locationId}</div>)}
        </main>
    );
}