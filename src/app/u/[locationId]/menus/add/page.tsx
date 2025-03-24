import { locationIdSchema } from "~/app/u/[locationId]/_domain/locations";
//import AddMenuDialog from "../_components/AddMenuDialog";
//import AddMenuDialog from "../_components/AddMenuDialog"
import { getAvailableQuota } from "~/app/_utils/quota-utils.server-only";
import AddMenuDialog from "~/app/u/[locationId]/menus/_components/AddMenuDialog";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO Test
    throw new Error("Location issue");
  }

  const availableQuota = await getAvailableQuota("menus");

  return <AddMenuDialog availableQuota={availableQuota} />;
}
