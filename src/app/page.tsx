import { db } from "~/server/db";

export const dynamic = "force-dynamic"

function TopNav() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>Logo</div>
      <div>Sign in</div>
    </nav>
  );
}

export default async function HomePage() {
  const items = await db.query.locations.findMany({orderBy: (model, {desc}) => desc(model.name)})

  return (
    <main className="flex min-h-screen flex-col    bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <TopNav/>
      <h1>hello</h1>
      {items.map(p => <div key={p.id}>{p.name}</div>)}
    </main>
  );
}
