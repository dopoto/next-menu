import * as React from "react";
import { getValidLocationIdOrThrow } from "~/app/_utils/location-utils";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;

  //TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parsedlocationId = getValidLocationIdOrThrow(params.locationId);

  const availableQuota = await getAvailableFeatureQuota("menuItems");

  return <>hi [{availableQuota}]</>;
}
