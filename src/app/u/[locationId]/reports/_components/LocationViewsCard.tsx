import { auth } from "@clerk/nextjs/server";
import * as React from "react";
import { ROUTES } from "~/app/_domain/routes";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { GenericReportsCard } from "~/app/u/[locationId]/reports/_components/GenericReportsCard";
import { getViews } from "~/app/u/[locationId]/reports/_utils/posthog-utils";
import { Skeleton } from "~/components/ui/skeleton";

export async function LocationViewsCard(props: {
  mode: "regular" | "placeholder" | "locked";
  locationId: LocationId;
}) {
  const title = "Total views";
  const footer = (
    <div className="text-muted-foreground">
      Visitors of your{" "}
      <a className="blue-link" href={ROUTES.location(props.locationId)}>
        public location page
      </a>
    </div>
  );

  if (props.mode === "placeholder") {
    return (
      <GenericReportsCard
        isLocked={false}
        title={title}
        value={<Skeleton className="h-[45px] w-[40px]" />}
        footer={footer}
      />
    );
  }

  if (props.mode === "locked") {
    return (
      <GenericReportsCard
        isLocked={true}
        title={title}
        value={"683562"}
        footer={footer}
      />
    );
  }

  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No userId or orgId found in auth.`);
  }

  const locationViewsValue = await getViews(orgId);
  const isError = locationViewsValue === null;

  return (
    <GenericReportsCard
      isLocked={false}
      isError={isError}
      title={title}
      value={locationViewsValue}
      footer={footer}
    />
  );
}
