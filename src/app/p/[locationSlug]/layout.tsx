import { locationSlugSchema } from "~/app/u/[locationId]/_domain/locations";

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
  const locationValidationResult = locationSlugSchema.safeParse(locationSlug);
  if (!locationValidationResult.success) {
    throw new Error(`Invalid location: ${locationSlug}`);
  }

  return (
    <>
      <p>Welcome to {locationValidationResult.data}</p>
      <p>{children}</p>
    </>
  );
}
