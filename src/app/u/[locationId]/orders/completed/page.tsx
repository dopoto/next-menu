"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export default function Home() {
    const orders = useQuery(api.orders.get);
    return (
        <main className="flex  flex-col ">
            {orders?.map(({ _id, status }) => <div key={_id}>{status}</div>)}
        </main>
    );
}