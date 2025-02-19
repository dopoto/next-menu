import Link from "next/link";
import { getLocations } from "~/server/queries";

type Params = Promise<{ id: string }>;

export default async function LocationModal(props: { params: Params }) {
  const params = await props.params;

  const items = await getLocations();

  return (
    <div>
      A route showing location with id = {params.id}
      {items.map((p) => (
        <div key={p.id}>
          <Link href={`/locations/${p.id}`}>{p.name}</Link>
        </div>
      ))}
    </div>
  );
}
