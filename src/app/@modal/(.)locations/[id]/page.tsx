import { getLocation } from "~/server/queries";
import { Modal } from "./modal";

type Params = Promise<{ id: string }>;

export default async function LocationModal(props: { params: Params }) {
  const params = await props.params;

  const item = await getLocation(parseInt(params.id));

  return (
    <Modal>
      A modal showing location with id = {params.id}: name={item.name}.
      Refreshing the page will show the /app/locations/[id] route instead.
    </Modal>
  );
}
