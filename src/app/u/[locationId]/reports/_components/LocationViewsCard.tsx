import { auth } from "@clerk/nextjs/server";
import * as React from "react";
import { ROUTES } from "~/app/_domain/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { type AnalyticsEventId } from "~/domain/analytics";
import { env } from "~/env";

export async function LocationViewsCard(props: { locationId: LocationId }) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error(`No userId or orgId found in auth.`);
  }

  const eventName: AnalyticsEventId = "publicLocationVisit";
  const url = `${env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}/query/`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.POSTHOG_ANALYTICS_QUERIES_API_KEY}`,
  };
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `
        SELECT 
          COUNT(*) AS visit_count 
        FROM 
          events 
        WHERE 
          event = '${eventName}' AND properties.orgId = '${orgId}'
          `,
    },
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json();

  const views = data.results[0];

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Total views</CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight tabular-nums @[250px]/card:text-4xl">
          {views}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="text-muted-foreground">
          Visitors of your{" "}
          <a className="blue-link" href={ROUTES.location(props.locationId)}>public location page</a>
        </div>
      </CardFooter>
    </Card>
  );
}
