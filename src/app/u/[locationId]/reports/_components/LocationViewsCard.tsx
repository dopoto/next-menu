import { auth } from "@clerk/nextjs/server";
import React from "react";
import { AnalyticsEventId } from "~/domain/analytics";
import { env } from "~/env";

export async function LocationViewsCard() {
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

  const data = await response.json();

  return <div>{data.results[0]}</div>;
}
