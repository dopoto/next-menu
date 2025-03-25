import { AnalyticsEventSender } from "~/app/_components/AnalyticsEventSender";
import { locationSlugSchema } from "~/app/u/[locationId]/_domain/locations";
import { getLocationPublicData } from "~/server/queries/location";

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
    throw new Error(`Invalid location: ${locationSlug}`);
  }
  
  const parsedLocationSlug = locationSlugValidationResult.data
  const location = await getLocationPublicData(parsedLocationSlug);

  return (
    <>
      <p>Welcome to {parsedLocationSlug} in org {location.orgId}</p>
      <p>{children}</p>
      <AnalyticsEventSender
        eventId="publicMenuVisit"
        payload={{
          orgId: location.orgId,
          locationSlug: parsedLocationSlug
        }}
      />
    </>
  );
}
