import AddMenuDialog from "../../_components/AddMenuDialog";
import { locationIdSchema } from "~/app/_domain/location";
import { getAvailableQuota } from "~/app/_utils/quota-utils";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO Test
    throw new Error("Location issue");
  }
 
  const availableQuota = await getAvailableQuota('menus');

  return <AddMenuDialog availableQuota={availableQuota} />;
}
