import { auth } from "@clerk/nextjs/server";
import * as React from "react";
import { ROUTES } from "~/app/_domain/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { GenericReportsCard } from "~/app/u/[locationId]/reports/_components/GenericReportsCard";
import { getViews } from "~/app/u/[locationId]/reports/_utils/posthog-utils";

export async function LocationViewsCard(props: { locationId: LocationId }) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No userId or orgId found in auth.`);
  }

  const locationViewsValue = await getViews(orgId); 

  return (
    <GenericReportsCard
      isLocked={false}
      title={"Total views"}
      value={locationViewsValue}
      footer={
        <div className="text-muted-foreground">
          Visitors of your{" "}
          <a className="blue-link" href={ROUTES.location(props.locationId)}>
            public location page
          </a>
        </div>
      }
    />
  );
}
