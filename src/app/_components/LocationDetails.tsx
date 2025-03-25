import React from "react";
import QRCode from "react-qr-code";
import { auth } from "@clerk/nextjs/server";
import { getLocation } from "~/server/queries";
import {
  type LocationId,
  locationIdSchema,
} from "~/app/u/[locationId]/_domain/locations";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { env } from "~/env";
import { ROUTES } from "~/app/_domain/routes";
import { SeparatorWithText } from "~/app/_components/SeparatorWithText";

export async function LocationDetails(props: { id: LocationId }) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No orgId found in auth.`);
  }

  const validationResult = locationIdSchema.safeParse(props.id);
  if (!validationResult.success) {
    // TODO Test
    throw new Error("Location issue");
  }

  const locationData = await getLocation(validationResult.data);

  if (!locationData.slug) {
    throw new Error("missinfg  slug ");
  }

  const locationUrl = `${env.NEXT_PUBLIC_APP_URL}${ROUTES.publicLocation(locationData.slug)}`;
  const locationName = locationData.name ?? "";

  return (
    <div className="flex w-full flex-col flex-nowrap gap-4">
      <div className="flex w-full gap-2">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
          {locationName.slice(0, 3).toLocaleUpperCase()}
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-tiny truncate antialiased">LOCATION</span>
          <span className="truncate font-semibold">{locationName}</span>
        </div>
      </div>
      <p className="text-center text-sm">Your location is live here:</p>

      <div className="flex w-full flex-row flex-nowrap gap-2 rounded">
        <ExternalLinkIcon className="stroke-gray-700" />
        <div className="grow">
          <a
            title={locationUrl}
            href={locationUrl}
            target="_blank"
            className="overflow-hidden font-normal text-ellipsis whitespace-nowrap text-blue-600 underline underline-offset-4"
          >
            {/* TODO 'https://start...end' at smaller resolutions */}
            {locationUrl}
          </a>
        </div>
        <CopyIcon className="stroke-gray-700" />
      </div>
      <SeparatorWithText title="OR" />
      <div className="flex w-full items-center justify-center">
        <QRCode value={locationUrl} size={128} />
      </div>
    </div>
  );
}
