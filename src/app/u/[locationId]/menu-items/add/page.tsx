import { locationIdSchema } from "~/app/u/[locationId]/_domain/locations";
import * as React from "react";
import { AppError } from "~/lib/error-utils.server";
import { getValidLocationIdOrThrow } from "~/app/_utils/location-utils";
import { getAvailableFeatureQuota } from "~/app/_utils/quota-utils.server-only";

type Params = Promise<{ locationId: string }>;

export default async function AddMenuItemPage(props: { params: Params }) {
  const params = await props.params;
  const parsedlocationId = getValidLocationIdOrThrow(params.locationId);

  const availableQuota = await getAvailableFeatureQuota("menuItems");

  return <>hi [{availableQuota}]</>;
}
