type Params = Promise<{ id: string }>;

export default async function LocationModal(props: { params: Params }) {
  const params = await props.params;
  return <div>A route showing location with id = {params.id}</div>;
}
