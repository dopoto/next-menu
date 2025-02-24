import React from "react";
import { getMyLocations } from "~/server/queries";

export default async function LocationsPage() {
  const items = await getMyLocations();
  return (
    <div className="rounded-lg bg-white/10">
      <h2 className="mb-4 text-xl">Manage Locations</h2>
      {items.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
