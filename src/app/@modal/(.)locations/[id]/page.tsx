import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function LocationModal(props: { params: Params }) {
  const params = await props.params;
  return <div>A modal showing location with id = {params.id}. Refreshing the page will show the /app/locations/[id] route instead.</div>;
}
