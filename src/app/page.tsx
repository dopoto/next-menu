import { db } from "~/server/db";
 
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });

  return (
    <main>
      <h1>hello home page</h1>
      {items.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </main>
  );
}
