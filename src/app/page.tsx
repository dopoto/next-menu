import Link from "next/link";
import { getLocations } from "~/server/queries";
import { TopNav } from "./_components/TopNav";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getLocations();
  return (
    <main>
      <TopNav />
      <h1>hello home page</h1>
      {items.map((p) => (
        <div key={p.id}>
          <Link href={`/locations/${p.id}`}>{p.name}</Link>
        </div>
      ))}
    </main>
  );
}
