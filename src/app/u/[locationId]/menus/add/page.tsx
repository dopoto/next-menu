import { locationIdSchema } from "~/app/u/[locationId]/_domain/locations";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";
import AddMenuDialog from "~/app/u/[locationId]/menus/_components/AddMenuDialog";
import * as React from "react";
import { AppError } from "~/lib/error-utils.server";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO Test
    throw new AppError({
      message: `Location validation failed. params: ${JSON.stringify(params)}`,
    });
  }

  const availableQuota = await getAvailableFeatureQuota("menus");

  //return <AddMenuDialog availableQuota={availableQuota} />;
  return <>hi</>;
}
