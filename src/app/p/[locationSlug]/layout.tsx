import { AnalyticsEventSender } from "~/app/_components/AnalyticsEventSender";
import { locationSlugSchema } from "~/app/u/[locationId]/_domain/locations";
import { getLocationPublicData } from "~/server/queries/location";
import { PostHog } from "posthog-node";
import { env } from "~/env";
import React from "react";
import type { AnalyticsEventId } from "~/domain/analytics";
import { CookieKey } from "~/app/_domain/cookies";
import { cookies } from "next/headers";
import { AppError } from "~/lib/error-utils.server";

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

//TODO Use cache

type Params = Promise<{ locationSlug: string }>;

export default async function Layout({
  params,
  children,
}: {
  params: Params;
  children: React.ReactNode;
}) {
  const locationSlug = (await params).locationSlug;
  const locationSlugValidationResult =
    locationSlugSchema.safeParse(locationSlug);
  if (!locationSlugValidationResult.success) {
    throw new AppError({ message: `Invalid location: ${locationSlug}` });
  }

  const parsedLocationSlug = locationSlugValidationResult.data;
  const location = await getLocationPublicData(parsedLocationSlug);

  const event: AnalyticsEventId = "publicLocationVisit";

  const cookieStore = cookies();
  const machineId = (await cookieStore).get(CookieKey.MachineId)?.value;

  posthog.capture({
    distinctId: machineId ?? "-- missing machine id --",
    event,
    properties: {
      orgId: location.orgId,
      locationSlug: parsedLocationSlug,
    },
  });

  return (
    <>
      <p>
        Welcome to {parsedLocationSlug} in org {location.orgId}
      </p>
      <p>{children}</p>
      <AnalyticsEventSender
        eventId="publicLocationVisit"
        payload={{
          orgId: location.orgId,
          locationSlug: parsedLocationSlug,
        }}
      />
    </>
  );
}
