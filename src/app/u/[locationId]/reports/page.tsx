import { Suspense } from "react";
import { locationIdSchema } from "../_domain/locations";
import { GenericReportsCard } from "~/app/u/[locationId]/reports/_components/GenericReportsCard";
import { ROUTES } from "~/app/_domain/routes";
import { auth } from "@clerk/nextjs/server";
import { LocationViewsCard } from "~/app/u/[locationId]/reports/_components/LocationViewsCard";

type Params = Promise<{ locationId: string }>;

export default async function ReportsPage(props: { params: Params }) {
  const params = await props.params;
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }
  const parsedLocationId = validationResult.data;

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No userId or orgId found in auth.`);
  }

  // Location Views card
  const locationViewsIsLocked = false;
  const locationViewsTitle = "Total views";

  const locationViewsFooter = (
    <div className="text-muted-foreground">
      Visitors of your{" "}
      <a className="blue-link" href={ROUTES.location(parsedLocationId)}>
        public location page
      </a>
    </div>
  );

  return (
    <div>
      <Suspense
        fallback={
          <GenericReportsCard
            isLocked={locationViewsIsLocked}
            title={locationViewsTitle}
            value={"..."}
            footer={locationViewsFooter}
          />
        }
      >
        <LocationViewsCard locationId={parsedLocationId} />
      </Suspense>
    </div>
  );
}
