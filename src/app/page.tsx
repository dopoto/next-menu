import { db } from "~/server/db";
import { TopNav } from "./_components/TopNav";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <TopNav />
      <h1>hello</h1>
      {items.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </main>
  );
}
