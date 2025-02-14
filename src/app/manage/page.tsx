import { getMyLocations } from "~/server/queries";

export default async function ManagePage() {
  const items = await getMyLocations();
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="text-xl mb-4">Manage Dashboard</h2>
      {items.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
